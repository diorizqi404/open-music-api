const { Pool } = require("pg");
const { mapDBToModelAlbums } = require("../../utils/index");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class AlbumsServices {
  constructor(cacheService) {
    this._pool = new Pool({
      host: process.env.PGHOST,
      port: process.env.PGPORT,
      database: process.env.PGDATABASE,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    this._cacheService = cacheService;
  }

  async addAlbum({ name, year }) {
    const { nanoid } = await import("nanoid");
    const id = `album-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO albums VALUES($1, $2, $3) RETURNING id",
      values: [id, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Album gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getAlbums() {
    const result = await this._pool.query("SELECT * FROM albums");
    return result.rows.map(mapDBToModelAlbums);
  }

  async getAlbumById(id) {
    const query = {
      text: "SELECT id, name, year, cover FROM albums WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Album tidak ditemukan");
    }

    return mapDBToModelAlbums(result.rows[0]);
  }

  async updateAlbumCover(id, coverUrl) {
    const query = {
      text: "UPDATE albums SET cover = $2 WHERE id = $1 RETURNING id",
      values: [id, coverUrl],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Album tidak ditemukan");
    }
  }

  async getSongByAlbumId(id) {
    const query = {
      text: 'SELECT id, title, performer FROM songs WHERE "albumId" = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    return result.rows.length ? result.rows : [];
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: "UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id",
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Gagal memperbarui album. Id tidak ditemukan");
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: "DELETE FROM albums WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Album gagal dihapus. Id tidak ditemukan");
    }
  }

  async addLike(userId, albumId) {
    await this.getAlbumById(albumId);

    const checkQuery = {
      text: "SELECT id FROM user_album_likes WHERE user_id = $1 AND album_id = $2",
      values: [userId, albumId],
    };
    const checkResult = await this._pool.query(checkQuery);

    if (checkResult.rowCount > 0) {
      throw new InvariantError(
        "Gagal menyukai album. Anda mungkin sudah menyukai album ini."
      );
    }

    const { nanoid } = await import("nanoid");
    const id = `like-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO user_album_likes (id, user_id, album_id) VALUES ($1, $2, $3) RETURNING id",
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);

    await this._cacheService.delete(`likes:${albumId}`);
    return result.rows[0].id;
  }

  async removeLike(userId, albumId) {
    await this.getAlbumById(albumId);

    const query = {
      text: "DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id",
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError(
        "Gagal batal menyukai album. Anda mungkin belum menyukai album ini."
      );
    }

    await this._cacheService.delete(`likes:${albumId}`);
  }

  async getLikesCount(albumId) {
    try {
      const result = await this._cacheService.get(`likes:${albumId}`);
      return { likes: JSON.parse(result), fromCache: true };;
    } catch {
      await this.getAlbumById(albumId);

      const query = {
        text: "SELECT COUNT(*) FROM user_album_likes WHERE album_id = $1",
        values: [albumId],
      };

      const result = await this._pool.query(query);
      const likesCount = parseInt(result.rows[0].count, 10);

      await this._cacheService.set(
        `likes:${albumId}`,
        JSON.stringify(likesCount)
      );

      return { likes: likesCount, fromCache: false };
    }
  }
}

module.exports = AlbumsServices;
