const SongsHandler = require('./handler')
const routes = require('./routes')

//mendaftarkan plugin
module.exports = {
    name: 'song',
    version: '1.0.0',
    register: async (server, { service, songValidator }) => {
        const songHandler = new SongsHandler(service, songValidator)
        server.route(routes(songHandler))
    }
}