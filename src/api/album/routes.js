const routes = (handler) => [
  {
    method: "POST",
    path: "/albums",
    handler: handler.postAlbumHandler,
  },
  {
    method: "GET",
    path: "/albums",
    handler: handler.getAlbumsHandler,
  },
  {
    method: "GET",
    path: "/albums/{id}",
    handler: handler.getAlbumByIdHandler,
  },
  {
    method: "PUT",
    path: "/albums/{id}",
    handler: handler.putAlbumByIdHandler,
  },
  {
    method: "DELETE",
    path: "/albums/{id}",
    handler: handler.deleteAlbumByIdHandler,
  },
  {
    method: "POST",
    path: "/albums/{id}/likes",
    handler: handler.postLikeHandler,
    options: {
      auth: "openmusic_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/albums/{id}/likes",
    handler: handler.deleteLikeHandler,
    options: {
      auth: "openmusic_jwt",
    },
  },
  {
    method: "GET",
    path: "/albums/{id}/likes",
    handler: handler.getLikesCountHandler,
  },
];

module.exports = routes;