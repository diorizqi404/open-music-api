require("dotenv").config();

const Hapi = require("@hapi/hapi");
const song = require("./api/song");
const album = require("./api/album");
const SongsServices = require("./services/postgres/SongsServices");
const AlbumsServices = require("./services/postgres/AlbumsServices");
const { AlbumValidator, SongValidator } = require("./validator/music/index");
const ClientError = require("./exceptions/ClientError");

const init = async () => {
  const songsServices = new SongsServices();
  const albumsServices = new AlbumsServices();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register([
    {
      plugin: song,
      options: {
        service: songsServices,
        songValidator: SongValidator,
      },
    },
    {
      plugin: album,
      options: {
        service: albumsServices,
        albumValidator: AlbumValidator,
      },
    },
  ]);

  server.ext("onPreResponse", (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      // penanganan client error secara internal.
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: "fail",
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
      if (!response.isServer) {
        return h.continue;
      }

      // penanganan server error sesuai kebutuhan
      const newResponse = h.response({
        status: "error",
        message: "terjadi kegagalan pada server kami",
      });
      newResponse.code(500);
      return newResponse;
    }

    // jika bukan error, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
