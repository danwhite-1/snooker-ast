const getPool = require('./get-pool');
const errjson = require('./errorJson');

const excludeErrASTsSQL = `matches.player1ast!='-1' AND matches.player2ast!='-1' AND matches.player1ast!='-2' AND matches.player2ast!='-2'`;

module.exports.getTournamanetById = (id) => {
    const qry = `SELECT * FROM tournaments
                 WHERE tournamentid=${id}`;
    return sendQuery(qry);
}

module.exports.getAllTournaments = () => {
    const qry = `SELECT * FROM tournaments
                 WHERE tournamentname NOT LIKE '%Qualifier%'`;
    return sendQuery(qry);
}

module.exports.getMatchesByTournamentId = (id) => {
    const qry = `SELECT * FROM matches
                 WHERE tournamentid=${id}`;
    return sendQuery(qry);
}

module.exports.getMatchByMatchID = (t_id, m_id) => {
    const qry = `SELECT * FROM matches
                 WHERE tournamentid=${t_id}
                  AND matchid=${m_id}`;
    return sendQuery(qry);
}

module.exports.getAllPlayers = () => {
    const qry = `SELECT * FROM players`;
    return sendQuery(qry);
}

module.exports.getMatchesByPlayerId = (p_id) => {
    const qry = `SELECT * FROM matches
                 WHERE player1id=${p_id}
                  OR player2id=${p_id}`;
    return sendQuery(qry);
}

module.exports.getNoOfTournamentMatchesByPlayerId = (p_id, t_id) => {
    const qry = `SELECT COUNT(*) FROM matches
                 WHERE tournamentid=${t_id}
                  AND (player1id=${p_id} OR player2id=${p_id})`;
    return sendQuery(qry);
}

module.exports.getAvgAstByTournamentId = (t_id) => {
    const qry = `SELECT (AVG(player1ast) +  AVG(player2ast)) / 2 AS avgast FROM matches
                 WHERE tournamentid=${t_id}
                  AND ${excludeErrASTsSQL};`
    return sendQuery(qry);
}

module.exports.getPlayerAvgAstForTournament = (p_id, t_id) => {
    const qry = `SELECT AVG(CASE WHEN player1id=${p_id} THEN player1ast ELSE player2ast END) as ast FROM matches
                 WHERE tournamentid=${t_id}
                  AND (player1id=${p_id} OR player2id=${p_id})
                  AND ${excludeErrASTsSQL};`;
    return sendQuery(qry);
}

module.exports.getAllUniquePlayerIdsByTournamentId = async (t_id) => {
    const qry1 = `SELECT DISTINCT player1id FROM matches WHERE tournamentid=${t_id}`;
    const qry2 = `SELECT DISTINCT player2id FROM matches WHERE tournamentid=${t_id}`;
    return [await sendQuery(qry1), await sendQuery(qry2)];
}

module.exports.getPlayerNameByPlayerId = (p_id) => {
    const qry = `SELECT playername FROM players
                 WHERE playerwstid=${p_id}`;
    return sendQuery(qry);
}

module.exports.getFastestMatchByTournament = (t_id) => {
    const qry = `SELECT matchid, player1id, player2id, roundno, MAX((player1ast + player2ast) / 2) as avgast FROM matches
                 WHERE tournamentid=${t_id}
                  AND ${excludeErrASTsSQL}
                 GROUP BY matchid
                 ORDER BY avgast ASC
                 LIMIT 1;`
    return sendQuery(qry);
}

module.exports.getSlowestMatchByTournament = (t_id) => {
    const qry = `SELECT matchid, player1id, player2id, roundno, MAX((player1ast + player2ast) / 2) as avgast FROM matches
                 WHERE tournamentid=${t_id}
                  AND ${excludeErrASTsSQL}
                 GROUP BY matchid
                 ORDER BY avgast DESC
                 LIMIT 1;`
    return sendQuery(qry);
}

module.exports.getAvgWinningASTByTournament = (t_id) => {
    const qry = `SELECT AVG(CASE WHEN player1score>player2score THEN player1ast ELSE player2ast END) as winningast FROM matches
                 WHERE tournamentid=${t_id}
                  AND ${excludeErrASTsSQL}`;
    return sendQuery(qry)
}

module.exports.getAvgLosingASTByTournament = (t_id) => {
    const qry = `SELECT AVG(CASE WHEN player1score<player2score THEN player1ast ELSE player2ast END) as losingast FROM matches
                 WHERE tournamentid=${t_id}
                  AND ${excludeErrASTsSQL}`;
    return sendQuery(qry)
}

module.exports.getFastestMatchForPlayer = (p_id) => {
    const qry = `SELECT CASE WHEN player1id=${p_id} THEN player2id ELSE player1id END as opposingplayer, tournamentid, MIN(CASE WHEN player1id=${p_id} THEN player1ast ELSE player2ast END) as ast FROM matches
                 WHERE (player1id=${p_id} OR player2id=${p_id})
                  AND ${excludeErrASTsSQL}
                 GROUP BY player1id, player2id, tournamentid
                 ORDER BY ast ASC
                 LIMIT 1`;
    return sendQuery(qry);
}

module.exports.getSlowestMatchForPlayer = (p_id) => {
    const qry = `SELECT CASE WHEN player1id=${p_id} THEN player2id ELSE player1id END as opposingplayer, tournamentid, MAX(CASE WHEN player1id=${p_id} THEN player1ast ELSE player2ast END) as ast FROM matches
                 WHERE (player1id=${p_id} OR player2id=${p_id})
                  AND ${excludeErrASTsSQL}
                 GROUP BY player1id, player2id, tournamentid
                 ORDER BY ast DESC
                 LIMIT 1`;
    return sendQuery(qry);
}

module.exports.getFastestTournamentForPlayer = (p_id) => {
    const qry = `SELECT AVG(CASE WHEN player1id=${p_id} THEN player1ast ELSE CASE WHEN player2id=${p_id} THEN player2ast END END) as ast, matches.tournamentid, tournamentname FROM matches
                 INNER JOIN tournaments ON matches.tournamentid=tournaments.tournamentid
                 WHERE (player1id=${p_id} OR player2id=${p_id})
                  AND ${excludeErrASTsSQL}
                 GROUP BY matches.tournamentid, tournamentname
                 ORDER BY ast ASC
                 LIMIT 1;`
    return sendQuery(qry);
}

module.exports.getSlowestTournamentForPlayer = (p_id) => {
    const qry = `SELECT AVG(CASE WHEN player1id=${p_id} THEN player1ast ELSE CASE WHEN player2id=${p_id} THEN player2ast END END) as ast, matches.tournamentid, tournamentname FROM matches
                 INNER JOIN tournaments ON matches.tournamentid=tournaments.tournamentid
                 WHERE (player1id=${p_id} OR player2id=${p_id})
                  AND ${excludeErrASTsSQL}
                 GROUP BY matches.tournamentid, tournamentname
                 ORDER BY ast DESC
                 LIMIT 1;`
    return sendQuery(qry);
}

module.exports.getAbsoluteAvgAstForPlayer = (p_id) => {
    const qry = `SELECT AVG(CASE WHEN player1id=${p_id} THEN player1ast ELSE CASE WHEN player2id=${p_id} THEN player2ast END END) as ast FROM matches
                 WHERE (player1id=${p_id} OR player2id=${p_id})
                  AND ${excludeErrASTsSQL}`;
    return sendQuery(qry);
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
