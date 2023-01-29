const getClient = require('./get-client');
const errjson = require('./errorJson');

module.exports.getTournamanetById = (id) => {
    const qry = `SELECT * FROM tournaments WHERE tournamentid=${id}`;
    return sendQuery(qry);
}

module.exports.getAllTournaments = () => {
    const qry = `SELECT * FROM tournaments WHERE tournamentname NOT LIKE '%Qualifier%'`;
    return sendQuery(qry);
}

module.exports.getMatchesByTournamentId = (id) => {
    const qry = `SELECT * FROM matches WHERE tournamentid=${id}`;
    return sendQuery(qry);
}

module.exports.getMatchByMatchID = (t_id, m_id) => {
    const qry = `SELECT * FROM matches WHERE tournamentid=${t_id} AND matchid=${m_id}`;
    return sendQuery(qry);
}

module.exports.getAllPlayers = () => {
    const qry = `SELECT * FROM players`;
    return sendQuery(qry);
}

module.exports.getMatchesByPlayerId = (p_id) => {
    const qry = `SELECT * from matches WHERE player1id=${p_id} OR player2id=${p_id}`;
    return sendQuery(qry);
}

sendQuery = async(query) => {
    const client = await getClient.getClient();
    try {
        const res = await client.query(query);
        await client.end();
        if(res.rows.length > 0 ) {
            return res.rows;
        }

        return errjson.createErrJson("no records found", "1");
    } catch (error) {
        return errjson.createErrJson(error.routine, error.code);
    }
}
