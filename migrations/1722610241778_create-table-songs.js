/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.createTable('songs', {
        id: {
            type: 'varchar',
            primaryKey: true,
            notNull: true
        },
        title: {
            type: 'string',
            notNull: true
        },
        year: {
            type: 'integer',
            notNull: true
        },
        genre: {
            type: 'string',
            notNull: true
        },
        performer: {
            type: 'string',
            notNull: true
        },
        duration: {
            type: 'integer',
        },
        albumId: {
            type: 'string',
        }
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('songs');
};
