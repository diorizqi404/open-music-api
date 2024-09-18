const AlbumsHandler = require('./handler')
const routes = require('./routes')

//mendaftarkan plugin
module.exports = {
    name: 'album',
    version: '1.0.0',
    register: async (server, { service, albumValidator }) => {
        const albumHandler = new AlbumsHandler(service, albumValidator)
        server.route(routes(albumHandler))
    }
}