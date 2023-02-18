const dotenv = require("dotenv").config({ path: "db_creds.env" })

module.exports.getPool = async () => {
    try {
        const pg = require('pg')
        return new pg.Pool({
            user: process.env.PGUSER,
            host: process.env.PGHOST,
            database: process.env.PGDATABASE,
            password: process.env.PGPASSWORD,
            idleTimeoutMillis: 1,
            max: 10,
            connectionTimeoutMillis: 2000,
        })
    } catch (error) {
        console.log(error)
    }
}