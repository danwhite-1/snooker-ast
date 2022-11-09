const getClient = require('./get-client');

module.exports.getTournamanetById = async(id) => {
    const client = await getClient.getClient();
    const qry = `SELECT * FROM tournaments WHERE tournamentid=${id}`;
    const res = await client.query(qry);
    await client.end();
    return res;
}

module.exports.getMatchesByTournamentId = async(id) => {
    const client = await getClient.getClient();
    const qry = `SELECT * FROM matches WHERE tournamentid=${id}`;
    const res = await client.query(qry);
    await client.end();
    return res;
}

module.exports.getMatchByMatchID = async(t_id, m_id) => {
    const client = await getClient.getClient();
    const qry = `SELECT * FROM matches WHERE tournamentid=${t_id} AND matchid=${m_id}`;
    const res = await client.query(qry);
    await client.end();
    return res;
}
