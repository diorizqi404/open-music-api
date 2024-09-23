class Listener {
  constructor(songsService, mailSender) {
    this._songsService = songsService;
    this._mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  async listen(message) {
    try {
      const { userId, targetEmail, playlistId } = JSON.parse(message.content.toString());
      console.log(`Received message: playlistId=${playlistId}, userId=${userId}, targetEmail=${targetEmail}`);

      const playlist = await this._songsService.getPlaylistSongs(playlistId, userId);
      console.log(`Playlist data: ${JSON.stringify(playlist)}`);

      const content = JSON.stringify(playlist);
      const result = await this._mailSender.sendEmail(targetEmail, content);

      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Listener;