const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const { mapDBToModelPlaylists } = require("../../utils");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationError");

class PlaylistsService {
  constructor(collaborationsService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService;
  }

  async addPlaylist({ name, owner }) {
    const { nanoid } = await import("nanoid");
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO playlists VALUES($1, $2, $3) RETURNING id",
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Playlist gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username
             FROM playlists
             LEFT JOIN users ON users.id = playlists.owner
             LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
             WHERE playlists.owner = $1 OR collaborations.user_id = $1
             GROUP BY playlists.id, users.username`,
      values: [owner],
    };
    const result = await this._pool.query(query);
    return result.rows.map(mapDBToModelPlaylists);
  }

  async deletePlaylistById(id) {
    const query = {
      text: "DELETE FROM playlists WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Gagal Playlist catatan. Id tidak ditemukan");
    }
  }

  async addSongToPlaylist(playlistId, songId) {
    const songQuery = {
      text: "SELECT id FROM songs WHERE id = $1",
      values: [songId],
    };
    const songResult = await this._pool.query(songQuery);

    if (!songResult.rows.length) {
      throw new NotFoundError("Lagu tidak ditemukan");
    }

    const { nanoid } = await import("nanoid");
    const id = nanoid(16);

    const query = {
      text: "INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id",
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Lagu gagal ditambahkan ke playlist");
    }

    return result.rows[0].id;
  }

  async getSongsFromPlaylist(playlistId) {
    const query = {
      text: `SELECT playlists.id as playlist_id, playlists.name as playlist_name, users.username, songs.id as song_id, songs.title, songs.performer
           FROM playlist_songs
           LEFT JOIN songs ON songs.id = playlist_songs.song_id
           LEFT JOIN playlists ON playlists.id = playlist_songs.playlist_id
           LEFT JOIN users ON users.id = playlists.owner
           WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    const playlist = {
      id: result.rows[0].playlist_id,
      name: result.rows[0].playlist_name,
      username: result.rows[0].username,
      songs: result.rows.map((row) => ({
        id: row.song_id,
        title: row.title,
        performer: row.performer,
      })),
    };

    return playlist;
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: "DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id",
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Lagu gagal dihapus dari playlist");
    }
  }

  async verifyPlaylistOwner(playlistId, owner) {
    const query = {
      text: "SELECT * FROM playlists WHERE id = $1",
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }
    const note = result.rows[0];
    if (note.owner !== owner) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      try {
        await this._collaborationsService.verifyCollaborator(
          playlistId,
          userId
        );
      } catch {
        throw new AuthorizationError(
          "Anda tidak berhak mengakses resource ini"
        );
      }
    }
  }

  async addPlaylistActivity(playlistId, songId, userId, action) {
    const { nanoid } = await import("nanoid");
    const id = `activity-${nanoid(16)}`;
    const time = new Date().toISOString();
    const query = {
      text: "INSERT INTO playlist_song_activities (id, playlist_id, song_id, user_id, action, time) VALUES ($1, $2, $3, $4, $5, $6)",
      values: [
        id,
        playlistId,
        songId,
        userId,
        action,
        time,
      ],
    };

    await this._pool.query(query);
  }

  async getPlaylistActivities(playlistId) {
    const query = {
      text: `SELECT users.username, songs.title, playlist_song_activities.action, playlist_song_activities.time
             FROM playlist_song_activities
             LEFT JOIN users ON users.id = playlist_song_activities.user_id
             LEFT JOIN songs ON songs.id = playlist_song_activities.song_id
             WHERE playlist_song_activities.playlist_id = $1
             ORDER BY playlist_song_activities.time ASC`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = PlaylistsService;
