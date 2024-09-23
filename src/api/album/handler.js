const autoBind = require("auto-bind");
const NotFoundError = require("../../exceptions/NotFoundError");
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
    album.songs = await this._service.getSongByAlbumId(id);

    return {
      status: "success",
      data: {
        album: {
          id: album.id,
          name: album.name,
          year: album.year,
          songs: album.songs,
          coverUrl: album.coverUrl ? album.coverUrl : null,
        },
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

  async postLikeHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { id: albumId } = request.params;

    console.log(
      "postLikeHandler called with userId:",
      userId,
      "albumId:",
      albumId
    ); // Tambahkan log ini untuk debugging

    try {
      await this._service.addLike(userId, albumId);
      return h
        .response({
          status: "success",
          message: "Album berhasil disukai",
        })
        .code(201);
    } catch (error) {
      console.log("Error in postLikeHandler:", error.message); // Tambahkan log ini untuk debugging
      if (error instanceof NotFoundError) {
        return h
          .response({
            status: "fail",
            message: error.message,
          })
          .code(404);
      }
      return h
        .response({
          status: "fail",
          message: error.message,
        })
        .code(400);
    }
  }

  async deleteLikeHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { id: albumId } = request.params;

    try {
      await this._service.removeLike(userId, albumId);
      return {
        status: "success",
        message: "Batal menyukai album berhasil",
      };
    } catch (error) {
      return h
        .response({
          status: "fail",
          message: error.message,
        })
        .code(400);
    }
  }

  async getLikesCountHandler(request, h) {
    const { id: albumId } = request.params;
    const { likes, fromCache } = await this._service.getLikesCount(albumId);

    const response = h.response({
      status: 'success',
      data: {
        likes,
      },
    });

    if (fromCache) {
      response.header("X-Data-Source", "cache");
    }

    return response;
  }
}

module.exports = AlbumsHandler;
