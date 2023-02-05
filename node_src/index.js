const { groupBy } = require('lodash');
const query = require('./queries')
const errjson = require('./errorJson');
const apiFunc = require('./api_funcs')
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
    if (!req.query.tournament) {
        const resp = errjson.createErrJson("Error: no tournament number provided", 4);
        res.send(JSON.stringify(resp));
    }

    if (req.query.action === "roundavg") {
        res.send(JSON.stringify(await apiFunc.tournamentRoundAvg(req.query.tournament)));
    } else if (req.query.action === "tournavg") {
        let tournData = await query.getAvgAstByTournamentId(req.query.tournament);
        tournData[0]["avgast"] = Math.round(tournData[0]["avgast"] * 10) / 10; // easier to round here than in psql
        res.end(JSON.stringify(tournData));
    } else {
        const resp = errjson.createErrJson("Error: action does not match available options", 3)
        res.send(JSON.stringify(resp));
    }
})

app.get('/api/players', async function (req, res) {
    const playerData = await query.getAllPlayers();
    res.end(JSON.stringify(playerData));
})

app.get('/api/playerdata', async function (req, res) {
    const action = req.query.action;
    if(action !== "tournavg") {
        const resp = errjson.createErrJson("Error: action does not match available options", 3)
        res.send(JSON.stringify(resp));
    }

    const p_id = req.query.player;
    if (!p_id) {
        const resp = errjson.createErrJson("Error: no player number provided", 4)
        res.send(JSON.stringify(resp));
    }

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

    res.end(JSON.stringify(ret, null, 2));
})

const server = app.listen(8000, function () {
    const host = server.address().address
    const port = server.address().port
    console.log("Snooker AST server listening at http://%s:%s", host, port)
})
