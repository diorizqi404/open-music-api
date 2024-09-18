const autoBind = require("auto-bind");

class AlbumsHandler {
    constructor(service, albumValidator) {
      this._service = service;
      this._albumValidator = albumValidator;
  
      autoBind(this);
    }

    async postAlbumHandler(request, h) {
      this._albumValidator.validateAlbumPayload(request.payload);
      const { name, year } = request.payload;
  
      const albumId = await this._service.addAlbum({ name, year });
  
      const response = h.response({
        status: "success",
        message: "Album berhasil ditambahkan",
        data: {
          albumId: albumId,
        },
      });
      response.code(201);
      return response;
    }
  
    async getAlbumsHandler() {
      const albums = await this._service.getAlbums();
  
      return {
        status: "success",
        data: {
          albums,
        },
      };
    }
  
    async getAlbumByIdHandler(request) {
      const { id } = request.params;
      const album = await this._service.getAlbumById(id);
      album.songs = await this._service.getSongByAlbumId(id)
  
      return {
        status: "success",
        data: {
          album,
        },
      };
    }
  
    async putAlbumByIdHandler(request) {
      this._albumValidator.validateAlbumPayload(request.payload);
      const { id } = request.params;
      const { name, year } = request.payload;
  
      await this._service.editAlbumById(id, { name, year });
  
      return {
        status: "success",
        message: "Album berhasil diperbarui",
      };
    }
  
    async deleteAlbumByIdHandler(request) {
      const { id } = request.params;
      await this._service.deleteAlbumById(id);
  
      return {
        status: "success",
        message: "Album berhasil dihapus",
      };
    }
}

module.exports = AlbumsHandler;