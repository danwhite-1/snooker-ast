const query = require('./queries')
var cors = require('cors');
const express = require('express');
const app = express();
app.use(cors());

app.get('/api/tournament/:t_id', async function (req, res) {
    const tournamentData = await query.getTournamanetById(req.params.t_id);
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

const server = app.listen(8000, function () {
    const host = server.address().address
    const port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})
