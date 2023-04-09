import { Component } from "react";

class PlayerStats extends Component {
    constructor(props) {
        super(props)
        this.state = {
            absoluteavg : "",
            fastesttournament : "",
            slowesttournament : "",
            fastestmatch : "",
            slowestmatch : "",
            we_have_data : false
        }
    }

    async componentDidMount() {
        if (this.props.playerid) {
            await this.loadData();
            this.setState({ we_have_data : true});
        }
    }

    async componentDidUpdate(prevProps) {
        if (this.props.playerid) {
            if (prevProps.playerid !== this.props.playerid) {
                await this.loadData();
                this.setState({ we_have_data : true});
            }
        }
    }

    // NOTE: There is also an API for fastest and slowest players but this
    // is not performant enough to be practical to use so has been omitted.
    api_calls = ["fastestmatch",
                 "slowestmatch",
                 "fastesttournament",
                 "slowesttournament",
                 "absoluteavg"];

    loadData = async () => {
        if (!this.props.playerid) return;

        let api_returns = {};
        for (const api_action of this.api_calls) {
            await fetch(`/api/playerdata?action=${api_action}&player=${this.props.playerid}`)
                .then(res => res.json())
                .then(res => {
                    api_returns[api_action] = res;
                })
                .catch(error => alert("An error occured getting player stats: " + error));
        }

        this.setState({
            absoluteavg : api_returns["absoluteavg"],
            fastesttournament : api_returns["fastesttournament"],
            slowesttournament : api_returns["slowesttournament"],
            fastestmatch : api_returns["fastestmatch"],
            slowestmatch : api_returns["slowestmatch"],
        })
    }

    render() {
        if (!this.state.we_have_data) {
            return (
                <div />
            )
        }

        return (
            <div className="PlayerStatsDiv">
                <p className="statPSingleLine">{this.state.absoluteavg[0]["ast"]}</p>
                <p className="statsPDualLine">{this.state.fastesttournament[0]["tournamentname"]}<br /> AST: {this.state.fastesttournament[0]["ast"]}</p>
                <p className="statsPDualLine">{this.state.slowesttournament[0]["tournamentname"]}<br /> AST: {this.state.slowesttournament[0]["ast"]}</p>
                <p className="statP">vs {this.state.fastestmatch["opposingplayer"]}, {this.state.fastestmatch["tournament"]}<br /> AST: {this.state.fastestmatch["ast"]}</p>
                <p className="statP">vs {this.state.slowestmatch["opposingplayer"]}, {this.state.slowestmatch["tournament"]}<br /> AST: {this.state.slowestmatch["ast"]}</p>
            </div>
        )
    }
}

export default PlayerStats
