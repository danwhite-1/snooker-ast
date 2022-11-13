const { Client } = require("pg")

// TODO improve error handling on connection
// TODO - move to use environment vars
// TODO - consider using connection pool over client
module.exports.getClient = async () => {
    try {
        const client = new Client({
            user: "postgres",
            host: "/tmp/",
            database: "snookertest",
            password: "myPassword",
        })
 
        await client.connect()
        return client;
    } catch (error) {
        console.log(error)
    }
}