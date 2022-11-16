const { Client } = require("pg")
const dotenv = require("dotenv").config({ path: "db_creds.env" })

// TODO improve error handling on connection
// TODO - consider using connection pool over client
module.exports.getClient = async () => {
    try {
        // User environment vars for credentials
        const client = new Client({
            user: process.env.PGUSER,
            host: process.env.PGHOST,
            database: process.env.PGDATABASE,
            password: process.env.PGPASSWORD,
        })
 
        await client.connect()
        return client;
    } catch (error) {
        console.log(error)
    }
}