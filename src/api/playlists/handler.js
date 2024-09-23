const autoBind = require("auto-bind");
const ClientError = require("../../exceptions/ClientError");

class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    try {
      this._validator.validatePostPlaylistPayload(request.payload);
      const { name } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      const playlistId = await this._service.addPlaylist({
        name,
        owner: credentialId,
      });

      const response = h.response({
        status: "success",
        message: "Playlist berhasil ditambahkan",
        data: {
          playlistId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return this._handleErrorResponse(error, h);
    }
  }

  async getPlaylistsHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const playlists = await this._service.getPlaylists(credentialId);

      return {
        status: "success",
        data: {
          playlists,
        },
      };
    } catch (error) {
      return this._handleErrorResponse(error, h);
    }
  }

  async deletePlaylistByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._service.verifyPlaylistOwner(id, credentialId);
      await this._service.deletePlaylistById(id);

      return {
        status: "success",
        message: "Playlist berhasil dihapus",
      };
    } catch (error) {
      return this._handleErrorResponse(error, h);
    }
  }

  async postSongToPlaylistHandler(request, h) {
    try {
      this._validator.validatePostSongToPlaylistPayload(request.payload);
      const { id: credentialId } = request.auth.credentials;
      const { id: playlistId } = request.params;
      const { songId } = request.payload;

      await this._service.verifyPlaylistAccess(playlistId, credentialId);

      const playlistSongId = await this._service.addSongToPlaylist(
        playlistId,
        songId
      );

      await this._service.addPlaylistActivity(playlistId, songId, credentialId, 'add');

      const response = h.response({
        status: "success",
        message: "Lagu berhasil ditambahkan ke playlist",
        data: {
          playlistSongId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return this._handleErrorResponse(error, h);
    }
  }

  async getSongsFromPlaylistHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const { id: playlistId } = request.params;
      await this._service.verifyPlaylistAccess(playlistId, credentialId);
      const playlist = await this._service.getSongsFromPlaylist(playlistId);

      return {
        status: "success",
        data: {
          playlist,
        },
      };
    } catch (error) {
      return this._handleErrorResponse(error, h);
    }
  }

  async deleteSongFromPlaylistHandler(request, h) {
    try {
      this._validator.validateDeleteSongFromPlaylistPayload(request.payload);
      const { id: credentialId } = request.auth.credentials;
      const { id: playlistId } = request.params;
      const { songId } = request.payload;

      await this._service.verifyPlaylistAccess(playlistId, credentialId);
      await this._service.deleteSongFromPlaylist(playlistId, songId);

      await this._service.addPlaylistActivity(playlistId, songId, credentialId, 'delete');
      
      return {
        status: "success",
        message: "Lagu berhasil dihapus dari playlist",
      };
    } catch (error) {
      return this._handleErrorResponse(error, h);
    }
  }

  async getPlaylistActivitiesHandler(request, h) {
    try {
      const { id: credentialId } = request.auth.credentials;
      const { id: playlistId } = request.params;

      await this._service.verifyPlaylistAccess(playlistId, credentialId);
      const { activities, fromCache } = await this._service.getPlaylistActivities(playlistId);

      const response = h.response({
        status: "success",
        data: {
          playlistId,
          activities,
        },
      });
  
      if (fromCache) {
        response.header("X-Data-Source", "cache");
      }

      return response;
      
    } catch (error) {
      return this._handleErrorResponse(error, h);
    }
  }

  _handleErrorResponse(error, h) {
    if (error instanceof ClientError) {
      const response = h.response({
        status: "fail",
        message: error.message,
      });
      response.code(error.statusCode);
      return response;
    }

    // Server ERROR!
    const response = h.response({
      status: "error",
      message: "Maaf, terjadi kegagalan pada server kami.",
    });
    response.code(500);
    console.error(error);
    return response;
  }
}

module.exports = PlaylistsHandler;
