const query = require('./queries')
const { groupBy } = require('lodash');

module.exports.tournamentRoundAvg = async (t_id) => {
    const matchData = await query.getMatchesByTournamentId(t_id);
    
    let roundMatches = {};
    let roundASTs = [{}]; // array to maintain consistency with other api returns
    let roundMatchCounter = {};
    for (const match of matchData) {
        if (!roundMatches.hasOwnProperty(match.roundno)) {
            roundMatches[match.roundno] = [];
            roundASTs[0][match.roundno] = 0;
            roundMatchCounter[match.roundno] = 0;
        }
        
        roundMatches[match.roundno].push(match);
        roundMatchCounter[match.roundno] += 1;
    }
    
    for (const round in roundMatches) {
        roundMatches[round].forEach(match => {
            roundASTs[0][match.roundno] += (match.player1ast + match.player2ast);
        });
    }
    
    for(const round in roundASTs[0]) {
        roundASTs[0][round] = Math.round((roundASTs[0][round] / roundMatchCounter[round] / 2) * 10) / 10;
    }

    return roundASTs;
}

module.exports.tournamentOverallAverage = async (t_id) => {
    let tournData = await query.getAvgAstByTournamentId(t_id);
    tournData[0]["avgast"] = Math.round(tournData[0]["avgast"] * 10) / 10; // easier to round here than in psql
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
    roundedAST = Math.round(avgWast[0]["winningast"] * 10) / 10
    return { "avgast" : roundedAST};
}

module.exports.averageLosingASTForTournament = async (t_id) => {
    const avgWast = await query.getAvgLosingASTByTournament(t_id);
    roundedAST = Math.round(avgWast[0]["losingast"] * 10) / 10
    return { "avgast" : roundedAST };
}

module.exports.getPlayerAverageForTournament = async (p_id) => {
    const playerMatches = await query.getMatchesByPlayerId(p_id);
    const grouped = groupBy(playerMatches, tournament => tournament.tournamentid);

    let ret = [{}];
    for (const t in grouped) {
        const tournament = grouped[t];
        let shotTimeTotal = 0;
        let incorrectVals = 0;
        for (const match of tournament) {
            if (match.player1ast == -1 || match.player2ast == -1) {
                incorrectVals++;
                break;
            }
            shotTimeTotal += match.player1id == p_id ? match.player1ast : match.player2ast;
        }
        ret[0][t] = Math.round((shotTimeTotal / (tournament.length - incorrectVals)) * 10) / 10;
    }

    return ret;
}