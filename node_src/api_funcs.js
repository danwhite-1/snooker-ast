const query = require('./queries')

module.exports.tournamentRoundAvg = async (t_id) => {
    let ret = [{}];
    const roundavgs = await query.getPerRoundAvgForTournament(t_id);
    for (r of roundavgs) {
        ret[0][r["roundno"]] = roundast(r["avg"]);
    }
    return ret;
}

module.exports.tournamentOverallAverage = async (t_id) => {
    let tournData = await query.getAvgAstByTournamentId(t_id);
    tournData[0]["avgast"] = roundast(tournData[0]["avgast"]);
    return tournData;
}

module.exports.fastestAndSlowestPlayerForTournament = async (t_id) => {
    const players = await query.getAllUniquePlayerIdsByTournamentId(t_id);
    const p_set = new Set();
    for(const p of players[0]){
        p_set.add(p["player1id"]);
    }
    for(const p of players[1]){
        p_set.add(p["player2id"]);
    }

    let currentFastest = {
        "playerid" : "",
        "ast" : 1000
    };

    let currentSlowest = {
        "playerid" : "",
        "ast" : -1
    }

    for(const player of p_set) {
        // Only include players who have more than one match
        const noOfMatchesInTourn = await query.getNoOfTournamentMatchesByPlayerId(player, t_id);
        if (noOfMatchesInTourn[0]["count"] < 2) continue;

        playerTournAST = await query.getPlayerAvgAstForTournament(player, t_id);
        if (playerTournAST[0]["ast"] < currentFastest["ast"]) {
            currentFastest = {
                "playerid" : player,
                "ast" : playerTournAST[0]["ast"]
            }
        } else if (playerTournAST[0]["ast"] > currentSlowest["ast"]) {
            currentSlowest = {
                "playerid" : player,
                "ast" : playerTournAST[0]["ast"]
            }
        }
    }

    currentFastest["player"] = (await query.getPlayerNameByPlayerId(currentFastest["playerid"]))[0]["playername"];
    currentSlowest["player"] = (await query.getPlayerNameByPlayerId(currentSlowest["playerid"]))[0]["playername"];

    return [currentFastest, currentSlowest];
}

module.exports.fastestMatchForTournament = async (t_id) => {
    const fm = await query.getFastestMatchByTournament(t_id);

    rtn_obj = {
        "player1" : (await query.getPlayerNameByPlayerId(fm[0]["player1id"]))[0]["playername"],
        "player2" : (await query.getPlayerNameByPlayerId(fm[0]["player2id"]))[0]["playername"],
        "roundno" : fm[0]["roundno"],
        "ast" : fm[0]["avgast"]
    }

    return rtn_obj;
}

module.exports.slowestMatchForTournament = async (t_id) => {
    const fm = await query.getSlowestMatchByTournament(t_id);

    rtn_obj = {
        "player1" : (await query.getPlayerNameByPlayerId(fm[0]["player1id"]))[0]["playername"],
        "player2" : (await query.getPlayerNameByPlayerId(fm[0]["player2id"]))[0]["playername"],
        "roundno" : fm[0]["roundno"],
        "ast" : fm[0]["avgast"]
    }

    return rtn_obj;
}

module.exports.averageWinningASTForTournament = async (t_id) => {
    const avgWast = await query.getAvgWinningASTByTournament(t_id);
    roundedAST = roundast(avgWast[0]["winningast"]);
    return { "avgast" : roundedAST};
}

module.exports.averageLosingASTForTournament = async (t_id) => {
    const avgWast = await query.getAvgLosingASTByTournament(t_id);
    roundedAST = roundast(avgWast[0]["losingast"]);
    return { "avgast" : roundedAST };
}

module.exports.getPlayerAverageForTournament = async (p_id) => {
    let ret = [{}];
    const tournavgs = await query.getPlayerAvgForTournament(p_id);
    console.log(tournavgs);
    for (t of tournavgs) {
        ret[0][t["tournamentid"]] = {
            "ast" : roundast(t["ast"]),
            "tournamentname" : t["tournamentname"],
        }
    }
    return ret;
}

module.exports.getFastestMatchForPlayer = async (p_id) => {
    const fm = await query.getFastestMatchForPlayer(p_id);
    const opposingplayer = await query.getPlayerNameByPlayerId(fm[0]["opposingplayer"]);
    const tournament = await query.getTournamanetById(fm[0]["tournamentid"]);

    rtn_obj = {
        "ast" : fm[0]["ast"],
        "opposingplayer" : opposingplayer[0]["playername"],
        "tournament" : tournament[0]["tournamentname"],
    }

    return rtn_obj;
}

module.exports.getSlowestMatchForPlayer = async (p_id) => {
    const fm = await query.getSlowestMatchForPlayer(p_id);
    const opposingplayer = await query.getPlayerNameByPlayerId(fm[0]["opposingplayer"]);
    const tournament = await query.getTournamanetById(fm[0]["tournamentid"]);

    rtn_obj = {
        "ast" : fm[0]["ast"],
        "opposingplayer" : opposingplayer[0]["playername"],
        "tournament" : tournament[0]["tournamentname"],
    }

    return rtn_obj;
}

module.exports.getFastestTournamentForPlayer = async (p_id) => {
    let fastestTourn = await query.getFastestTournamentForPlayer(p_id);
    fastestTourn[0]["ast"] = roundast(fastestTourn[0]["ast"]);
    return fastestTourn;
}

module.exports.getSlowestTournamentForPlayer = async (p_id) => {
    let slowestTourn = await query.getSlowestTournamentForPlayer(p_id);
    slowestTourn[0]["ast"] = roundast(slowestTourn[0]["ast"]);
    return slowestTourn;
}

module.exports.getAbsoluteAvgAstForPlayer = async (p_id) => {
    let abavg = await query.getAbsoluteAvgAstForPlayer(p_id);
    abavg[0]["ast"] = roundast(abavg[0]["ast"]);
    return abavg;
}

roundast = (val) => {
    return Math.round(val * 10) / 10;
}
