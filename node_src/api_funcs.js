const query = require('./queries')

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