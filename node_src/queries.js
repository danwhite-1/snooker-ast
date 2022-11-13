const getClient = require('./get-client');

module.exports.getTournamanetById = (id) => {
    const qry = `SELECT * FROM tournaments WHERE tournamentid=${id}`;
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

sendQuery = async(query) => {
    const client = await getClient.getClient();
    try {
        const res = await client.query(query);
        await client.end();
        return res.rows;
    } catch (error) {
        const error_json = [{'error' : 'true',
                             'e_msg' : error.routine,
                             'e_code' : error.code }];
        return error_json;
    }
}
