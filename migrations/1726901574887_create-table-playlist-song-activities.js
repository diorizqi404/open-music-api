/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.createTable('playlist_song_activities', {
        id: {
          type: 'VARCHAR(50)',
          primaryKey: true,
        },
        playlist_id: {
          type: 'VARCHAR(50)',
          notNull: true,
          references: '"playlists"(id)',
          onDelete: 'CASCADE',
        },
        song_id: {
          type: 'VARCHAR(50)',
          notNull: true,
        },
        user_id: {
          type: 'VARCHAR(50)',
          notNull: true,
        },
        action: {
          type: 'VARCHAR(10)',
          notNull: true,
        },
        time: {
          type: 'TIMESTAMP',
          notNull: true,
          default: pgm.func('current_timestamp'),
        },
      });

      pgm.addConstraint('playlist_song_activities', 'fk_playlist_song_activities.playlist_id_playlists.id', {
        foreignKeys: {
          columns: 'playlist_id',
          references: 'playlists(id)',
          onDelete: 'CASCADE',
        },
      });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('playlist_song_activities');
};
