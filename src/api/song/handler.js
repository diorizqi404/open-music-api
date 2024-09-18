const autoBind = require("auto-bind");

class SongsHandler {
  constructor(service, songValidator) {
    this._service = service;
    this._songValidator = songValidator;

    autoBind(this);
  }

  async postSongHandler(request, h) {
    this._songValidator.validateSongPayload(request.payload);
    const { title, year, performer, genre, duration, albumId } =
      request.payload;

    const songId = await this._service.addSong({
      title,
      year,
      performer,
      genre,
      duration,
      albumId,
    });

    const response = h.response({
      status: "success",
      message: "Lagu berhasil ditambahkan",
      data: {
        songId: songId,
      },
    });
    response.code(201);
    return response;
  }

  async getSongsHandler(request) {
    const { title, performer } = request.query
    const songs = await this._service.getSongs({title, performer});

    // const formattedSongs = songs.map((song) => ({
    //   id: song.id,
    //   title: song.title,
    //   performer: song.performer,
    // }));

    return {
      status: "success",
      data: {
        songs: songs,
      },
    };
  }

  async getSongByIdHandler(request) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);

    return {
      status: "success",
      data: {
        song,
      },
    };
  }

  async putSongByIdHandler(request) {
    this._songValidator.validateSongPayload(request.payload);
    const { id } = request.params;
    const { title, year, performer, genre, duration, albumId } =
      request.payload;

    await this._service.editSongById(id, {
      title,
      year,
      performer,
      genre,
      duration,
      albumId,
    });

    return {
      status: "success",
      message: "Lagu berhasil diperbarui",
    };
  }

  async deleteSongByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteSongById(id);

    return {
      status: "success",
      message: "Lagu berhasil dihapus",
    };
  }
}

module.exports = SongsHandler;
