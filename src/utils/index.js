const mapDBToModelAlbums = ({ id, name, year, cover }) => ({
    id,
    name,
    year,
    coverUrl: cover, // Pastikan kolom cover dipetakan ke coverUrl
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