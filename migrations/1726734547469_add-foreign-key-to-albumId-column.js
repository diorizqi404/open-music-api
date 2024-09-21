/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */


/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    // Add foreign key constraint to albumId column
    pgm.addConstraint('songs', 'fk_songs.albumId_albums.id', 'FOREIGN KEY("albumId") REFERENCES albums(id) ON DELETE CASCADE');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {};
