import { Component } from "react";

class TournamentStats extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tournavg : "",
            fastestmatch : "",
            slowestmatch : "",
            avgwinast : "",
            avgloseast : "",
            we_have_data : false
        }
    }

    async componentDidMount() {
        await this.loadData();
        this.setState({ we_have_data : true});
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.tournamentid !== this.props.tournamentid) {
            await this.loadData();
            this.setState({ we_have_data : true});
        }
    }

    // NOTE: There is also an API for fastest and slowest players but this
    // is not performant enough to be practical to use so has been omitted.
    api_calls = ["tournavg",
                 "fastestmatch",
                 "slowestmatch",
                 "avgwinast",
                 "avgloseast"];

    loadData = async () => {
        if (!this.props.tournamentid) return;

        let api_returns = {};
        for (const api_action of this.api_calls) {
            await fetch(`/api/tournamentdata?action=${api_action}&tournament=${this.props.tournamentid}`)
                .then(res => res.json())
                .then(res => {
                    api_returns[api_action] = res;
                })
                .catch(error => alert("An error occured getting tournament stats: " + error));
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
        if (!this.state.we_have_data) {
            return (
                <div />
            )
        }

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