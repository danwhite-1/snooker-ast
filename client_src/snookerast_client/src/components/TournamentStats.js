import { Component } from "react";

class TournamentStats extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tournavg : "50",
            fastestmatch : "",
            slowestmatch : "",
            avgwinast : "",
            avgloseast : "",
        }
    }

    componentDidMount() {
        this.loadData();
    }

    // NOTE: There is also an API for fastest and slowest players but this
    // is not performant enough to be practical to use so has been omitted.
    api_calls = ["tournavg",
                 "fastestmatch",
                 "slowestmatch",
                 "avgwinast",
                 "avgloseast"];

    loadData = async () => {
        const tmp_tid = "14563"; // to be replaced by value provided by props
        let api_returns = {};
        for (const api_action of this.api_calls) {
            await fetch(`/api/tournamentdata?action=${api_action}&tournament=${tmp_tid}`)
                .then(res => res.json())
                .then(res => {
                    api_returns[api_action] = res;
                });
        }

        this.setState({
            tournavg : api_returns["tournavg"],
            fastestmatch : api_returns["fastestmatch"],
            slowestmatch : api_returns["slowestmatch"],
            avgwinast : api_returns["avgwinast"],
            avgloseast : api_returns["avgloseast"]
        })
    }

    render() {
        return (
            <div>
                <p>Tournament Average AST: {this.state.tournavg[0]["avgast"]}</p>
                <p>Fastest Match: {this.state.fastestmatch["player1"]} vs {this.state.fastestmatch["player2"]} ({this.state.fastestmatch["roundno"]}, AST: {this.state.fastestmatch["ast"]})</p>
                <p>Slowest Match: {this.state.slowestmatch["player1"]} vs {this.state.slowestmatch["player2"]} ({this.state.fastestmatch["roundno"]}, AST: {this.state.fastestmatch["ast"]})</p>
                <p>Average Winning AST: {this.state.avgwinast["avgast"]}</p>
                <p>Average Losing AST: {this.state.avgloseast["avgast"]}</p>
            </div>
        )
    }
}

export default TournamentStats