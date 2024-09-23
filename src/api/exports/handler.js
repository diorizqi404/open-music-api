const autoBind = require('auto-bind');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const InvariantError = require('../../exceptions/InvariantError');

class ExportsHandler {
  constructor(service, validator, playlistsService) {
    this._service = service;
    this._validator = validator;
    this._playlistsService = playlistsService;

    autoBind(this);
  }

  async postExportSongHandler(request, h) {
    try {
      this._validator.validateExportSongsPayload(request.payload);

      const { id: credentialId } = request.auth.credentials;
      const { id: playlistId } = request.params;

      // Verifikasi apakah playlist ada dan milik pengguna yang membuat permintaan
      await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId); // Perbaiki ini

      const message = {
        userId: credentialId,
        targetEmail: request.payload.targetEmail,
        playlistId,
      };

      await this._service.sendMessage('export:songs', JSON.stringify(message));

      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses',
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof NotFoundError) {
        const response = h.response({
          status: 'fail',
          message: 'Playlist tidak ditemukan',
        });
        response.code(404);
        return response;
      } else if (error instanceof AuthorizationError) {
        const response = h.response({
          status: 'fail',
          message: 'Anda tidak berhak mengakses resource ini',
        });
        response.code(403);
        return response;
      } else if (error instanceof InvariantError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(400);
        return response;
      }

      // Penanganan error lainnya
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = ExportsHandler;