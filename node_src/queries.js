const getPool = require('./get-pool');
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

module.exports.getNoOfTournamentMatchesByPlayerId = (p_id, t_id) => {
    const qry = `SELECT COUNT(*) from matches WHERE tournamentid=${t_id} AND (player1id=${p_id} OR player2id=${p_id})`;
    return sendQuery(qry);
}

module.exports.getAvgAstByTournamentId = (t_id) => {
    const qry = `SELECT (AVG(player1ast) +  AVG(player2ast)) / 2 AS avgast FROM matches WHERE tournamentid=${t_id};`
    return sendQuery(qry);
}

module.exports.getPlayerAvgAstForTournament = (p_id, t_id) => {
    const qry = `SELECT AVG(CASE WHEN player1id=${p_id} THEN player1ast ELSE player2ast END) as ast FROM matches WHERE tournamentid=${t_id} AND (player1id=${p_id} OR player2id=${p_id});`;
    return sendQuery(qry);
}

module.exports.getAllUniquePlayerIdsByTournamentId = async (t_id) => {
    const qry1 = `SELECT DISTINCT player1id FROM matches WHERE tournamentid=${t_id}`;
    const qry2 = `SELECT DISTINCT player2id FROM matches WHERE tournamentid=${t_id}`;
    return [await sendQuery(qry1), await sendQuery(qry2)];
}

module.exports.getPlayerNameByPlayerId = (p_id) => {
    const qry = `SELECT playername FROM players WHERE playerwstid=${p_id}`;
    return sendQuery(qry);
}

module.exports.getFastestMatchByTournament = (t_id) => {
    const qry = `SELECT matchid, player1id, player2id, roundno, MAX((player1ast + player2ast) / 2) as avgast FROM matches WHERE tournamentid=${t_id} GROUP BY matchid ORDER BY avgast ASC LIMIT 1;`
    return sendQuery(qry);
}

module.exports.getSlowestMatchByTournament = (t_id) => {
    const qry = `SELECT matchid, player1id, player2id, roundno, MAX((player1ast + player2ast) / 2) as avgast FROM matches WHERE tournamentid=${t_id} GROUP BY matchid ORDER BY avgast DESC LIMIT 1;`
    return sendQuery(qry);
}

module.exports.getAvgWinningASTByTournament = (t_id) => {
    const qry = `SELECT AVG(CASE WHEN player1score>player2score THEN player1ast ELSE player2ast END) as winningast FROM matches WHERE tournamentid=${t_id}`;
    return sendQuery(qry)
}

module.exports.getAvgLosingASTByTournament = (t_id) => {
    const qry = `SELECT AVG(CASE WHEN player1score<player2score THEN player1ast ELSE player2ast END) as losingast FROM matches WHERE tournamentid=${t_id}`;
    return sendQuery(qry)
}

sendQuery = async(query) => {
    try {
        const pool = await getPool.getPool();
        res = await pool.query(query);

        if(res.rows.length > 0 ) {
            return res.rows;
        }

        return errjson.createErrJson("no records found", "1");
    } catch (error) {
        return errjson.createErrJson(error.routine, error.code);
    }
}
