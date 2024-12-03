const { Pool } = require('pg')
const InvariantError = require('../../exceptions/InvariantError')

class AuthenticationsService {
    constructor() {
        this._pool = new Pool({
            host: process.env.PGHOST,
            port: process.env.PGPORT,
            database: process.env.PGDATABASE,
            user: process.env.PGUSER,
            password: process.env.PGPASSWORD,
            ssl: {
              rejectUnauthorized: false, // Tambahkan ini jika Anda tidak menggunakan SSL
            },
          });
    }

    async addRefreshToken(token) {
        const query = {
            text: 'INSERT INTO authentications VALUES($1)',
            values: [token],
        }

        await this._pool.query(query)
    }

    async verifyRefreshToken(token) {
        const query = {
            text: 'SELECT token FROM authentications WHERE token = $1',
            values: [token]
        }

        const result = await this._pool.query(query)

        if (!result.rows.length) {
            throw new InvariantError('Refresh token tidak valid')
        }
    }

    async deleteRefreshToken(token) {
        const query = {
            text: 'DELETE FROM authentications WHERE token = $1',
            values: [token]
        }

        await this._pool.query(query)
    }
}

module.exports = AuthenticationsService