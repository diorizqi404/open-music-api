const { Pool } = require('pg');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async verifyPlaylistAccess(playlistId, userId) {
    const query = {
      text: `SELECT playlists.owner, collaborations.user_id AS collaborator
             FROM playlists
             LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
             WHERE playlists.id = $1`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new Error('Playlist tidak ditemukan');
    }

    const playlist = result.rows[0];

    if (playlist.owner !== userId && playlist.collaborator !== userId) {
      throw new Error('Anda tidak berhak mengakses resource ini');
    }
  }

  async getPlaylistSongs(playlistId, userId) {
    await this.verifyPlaylistAccess(playlistId, userId);

    const query = {
      text: `SELECT playlists.id AS playlist_id, playlists.name AS playlist_name, songs.id AS song_id, songs.title, songs.performer
             FROM playlists
             LEFT JOIN playlist_songs ON playlist_songs.playlist_id = playlists.id
             LEFT JOIN songs ON songs.id = playlist_songs.song_id
             WHERE playlists.id = $1`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new Error('Playlist tidak ditemukan');
    }

    const playlist = {
      id: result.rows[0].playlist_id,
      name: result.rows[0].playlist_name,
      songs: result.rows.map(row => ({
        id: row.song_id,
        title: row.title,
        performer: row.performer,
      })),
    };

    return { playlist };
  }
}

module.exports = SongsService;