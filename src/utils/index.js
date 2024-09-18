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

module.exports = { mapDBToModelAlbums, mapDBToModelSongs };