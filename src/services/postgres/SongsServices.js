const { Pool } = require("pg");
const {
  mapDBToModelSongs,
} = require("../../utils/index");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class SongsServices {
  constructor() {
    this._pool = new Pool({
      host: process.env.PGHOST,
      port: process.env.PGPORT,
      database: process.env.PGDATABASE,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      ssl: {
        rejectUnauthorized: false, // Tambahkan ini jika Anda tidak menggunakan SSL
      },
    });
  }

  async addSong({ title, year, performer, genre, duration, albumId }) {
    const { nanoid } = await import("nanoid");
    const id = `song-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      values: [id, title, year, genre, performer, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Lagu gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getSongs({ title, performer }) {
    let query;

    if (title != null && performer != null) {
      query = {
        text: "SELECT id, title, performer FROM songs WHERE LOWER(title) LIKE $1 AND LOWER(performer) LIKE $2",
        values: [`%${title}%`, `%${performer}%`],
      };
    } else if (title != null) {
      query = {
        text: "SELECT id, title, performer FROM songs WHERE LOWER(title) LIKE $1",
        values: [`%${title}%`],
      };
    } else if (performer != null) {
      query = {
        text: "SELECT id, title, performer FROM songs WHERE LOWER(performer) LIKE $1",
        values: [`%${performer}%`],
      };
    }else {
        query = {
            text: "SELECT id, title, performer FROM songs",
        };
    }

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getSongById(id) {
    const query = {
      text: "SELECT * FROM songs WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Lagu tidak ditemukan");
    }

    return result.rows.map(mapDBToModelSongs)[0];
  }

  async editSongById(id, { title, year, performer, genre, duration, albumId }) {
    const query = {
      // menggunakan "" untuk mencari secara spesifik (bukan ke variabel)
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $4, duration = $5, "albumId" = $6 WHERE id = $7 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Gagal memperbarui lagu. Id tidak ditemukan");
    }
  }

  async deleteSongById(id) {
    const query = {
      text: "DELETE FROM songs WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Lagu gagal dihapus. Id tidak ditemukan");
    }
  }
}

module.exports = SongsServices;
