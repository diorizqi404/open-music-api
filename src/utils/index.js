const mapDBToModelAlbums = ({
    id,
    name,
    year
}) => ({
    id,
    name,
    year
});

const mapDBToModelSongs = ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    albumId
}) => ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    albumId
});

const mapDBToModelPlaylists = ({ id, name, username }) => ({
    id,
    name,
    username,
  });

module.exports = { mapDBToModelAlbums, mapDBToModelSongs, mapDBToModelPlaylists };