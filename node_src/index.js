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

    const roundCounts = {};
    const matchData = await query.getMatchesByTournamentId(t_id);
    for (const num of matchData) {
        roundCounts[num.roundno] = roundCounts[num.roundno] ? roundCounts[num.roundno] + 1 : 1;
    }

    let astArr = [];
    for(let s = 0; s < Object.keys(roundCounts).length; s++) {
        astArr.push(0);
    }

    for(let i = 0; i < matchData.length; i++) {
        // handle "not found"
        for(let j = 0; j < astArr.length; j++) {
            if (matchData[i].roundno.includes(String(j+1))) {
                astArr[j] = astArr[j] + matchData[i].player1ast + matchData[i].player2ast;
                continue;
            }
        }

        // check bounds here
        if (matchData[i].roundno.includes("quarter")) {
            astArr[astArr.length - 3] = astArr[astArr.length - 3] + matchData[i].player1ast + matchData[i].player2ast;
        } else if (matchData[i].roundno.includes("semi")) {
            astArr[astArr.length - 2] = astArr[astArr.length - 2] + matchData[i].player1ast + matchData[i].player2ast;
        } else {
            astArr[astArr.length - 1]= astArr[astArr.length - 1] + matchData[i].player1ast + matchData[i].player2ast;
        }
    }

    for(let i = 0; i < astArr.length; i++) {
        astArr[i] = astArr[i] / Object.values(roundCounts)[i] / 2; // divide by number of matches and number of players
        astArr[i] = Math.round(astArr[i] * 10) / 10; // round to 1 dp
    }

    res.send(JSON.stringify(astArr));
})

const server = app.listen(8000, function () {
    const host = server.address().address
    const port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})
