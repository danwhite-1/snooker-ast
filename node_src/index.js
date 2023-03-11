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

app.get('/api/players', async function (req, res) {
    const playerData = await query.getAllPlayers();
    res.end(JSON.stringify(playerData));
})

app.get('/api/tournamentdata',  async function (req, res) {
    if (!req.query.tournament) {
        const resp = errjson.createErrJson("Error: no tournament number provided", 4);
        res.send(JSON.stringify(resp));
    }

    switch(req.query.action) {
        case "roundavg":
            res.send(JSON.stringify(await apiFunc.tournamentRoundAvg(req.query.tournament)));
            break;
        case "tournavg":
            res.send(JSON.stringify(await apiFunc.tournamentOverallAverage(req.query.tournament)));
            break;
        case "fastestandslowestplayers":
            res.send(JSON.stringify(await apiFunc.fastestAndSlowestPlayerForTournament(req.query.tournament)));
            break;
        case "fastestmatch":
            res.send(JSON.stringify(await apiFunc.fastestMatchForTournament(req.query.tournament)));
            break;
        case "slowestmatch":
            res.send(JSON.stringify(await apiFunc.slowestMatchForTournament(req.query.tournament)));
            break;
        case "avgwinast":
            res.send(JSON.stringify(await apiFunc.averageWinningASTForTournament(req.query.tournament)));
            break;
        case "avgloseast":
            res.send(JSON.stringify(await apiFunc.averageLosingASTForTournament(req.query.tournament)));
            break;
        default:
            const resp = errjson.createErrJson("Error: action does not match available options", 3)
            res.send(JSON.stringify(resp));
    }
})


app.get('/api/playerdata', async function (req, res) {
    const p_id = req.query.player;
    if (!p_id) {
        const resp = errjson.createErrJson("Error: no player number provided", 4)
        res.send(JSON.stringify(resp));
    }

    switch (req.query.action) {
        case "tournavg":
            res.send(JSON.stringify(await apiFunc.getPlayerAverageForTournament(req.query.player)));
            break;
        case "fastestmatch":
            res.send(JSON.stringify(await apiFunc.getFastestMatchForPlayer(req.query.player)));
            break;
        case "slowestmatch":
            res.send(JSON.stringify(await apiFunc.getSlowestMatchForPlayer(req.query.player)));
            break;
        case "fastesttournament":
            res.send(JSON.stringify(await apiFunc.getFastestTournamentForPlayer(req.query.player)));
            break;
        case "slowesttournament":
            res.send(JSON.stringify(await apiFunc.getSlowestTournamentForPlayer(req.query.player)));
            break;
        default:
            const resp = errjson.createErrJson("Error: action does not match available options", 3);
            res.send(JSON.stringify(resp));
    }
})

const server = app.listen(8000, function () {
    const host = server.address().address
    const port = server.address().port
    console.log("Snooker AST server listening at http://%s:%s", host, port)
})
