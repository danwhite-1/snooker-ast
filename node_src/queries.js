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

createErrJson = (err_msg, err_code) => {
    return [{'error' : 'true',
             'e_msg' : err_msg,
             'e_code' : err_code}];
}

sendQuery = async(query) => {
    const client = await getClient.getClient();
    try {
        const res = await client.query(query);
        await client.end();
        if(res.rows.length > 0 ) {
            return res.rows;
        }

        return createErrJson("no records found", "1");
    } catch (error) {
        return createErrJson(error.routine, error.code);
    }
}
