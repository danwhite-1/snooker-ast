const query = require('./queries')
const errjson = require('./errorJson');
var cors = require('cors');
const express = require('express');
const app = express();
app.use(cors());

app.get('/api/tournament/:t_id', async function (req, res) {
    const tournamentData = await query.getTournamanetById(req.params.t_id);
    res.end(JSON.stringify(tournamentData));
})

app.get('/api/tournaments', async function (req, res) {
    const tournamentData = await query.getAllTournaments();
    res.end(JSON.stringify(tournamentData));
})

app.get('/api/match/:t_id', async function (req, res) {
    const matchData = await query.getMatchesByTournamentId(req.params.t_id);
    res.end(JSON.stringify(matchData));
})

app.get('/api/match/:t_id/:m_id', async function (req, res) {
    const matchData = await query.getMatchByMatchID(req.params.t_id, req.params.m_id);
    res.end(JSON.stringify(matchData));
})

app.get('/api/tournamentdata',  async function (req, res) {
    const action = req.query.action;
    if(action !== "roundavg") {
        const resp = errjson.createErrJson("Error: action does not match available options", 3)
        res.send(JSON.stringify(resp));
    }

    const t_id = req.query.tournament;
    if (!t_id) {
        const resp = errjson.createErrJson("Error: no tournament number provided", 4)
        res.send(JSON.stringify(resp));
    }

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

    res.send(JSON.stringify(roundASTs));
})

const server = app.listen(8000, function () {
    const host = server.address().address
    const port = server.address().port
    console.log("Snooker AST server listening at http://%s:%s", host, port)
})
