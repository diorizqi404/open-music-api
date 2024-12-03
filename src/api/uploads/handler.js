const autoBind = require("auto-bind");

class UploadsHandler {
  constructor(service, validator, albumsService) {
    this._service = service;
    this._validator = validator;
    this._albumsService = albumsService;

    autoBind(this);
  }

  async postUploadImageHandler(request, h) {
    const { cover } = request.payload;
    const { id: albumId } = request.params;

    this._validator.validateImageHeaders(cover.hapi.headers);
    // this._validator.validateImagePayload({ file: cover });

    const filename = await this._service.writeFile(cover, cover.hapi);
    const coverUrl = `http://${process.env.SERVER_URL}:${process.env.PORT}/upload/images/${filename}`;

    await this._albumsService.updateAlbumCover(albumId, coverUrl);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;