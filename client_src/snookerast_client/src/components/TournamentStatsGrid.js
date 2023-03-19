import { Component } from "react";
import TournamentStats from "./TournamentStats";

class TournamentStatsGrid extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        if(!this.props.tournamentIds.length) {
            return (
                <div />
            )
        }

        return (
            <div className="TournamentStatsGridDiv">
                <div className="TournamentStatsDiv TournamentStatsTitleDiv">
                    <p className="statP">Tournament Average AST:</p>
                    <p className="statP">Fastest Match:</p>
                    <p className="statP">Slowest Match:</p>
                    <p className="statP">Average Winning AST:</p>
                    <p className="statP">Average Losing AST:</p>
                </div>
                {Array(this.props.tournamentIds.length).fill(0).map((_, i) => <TournamentStats key={i} tournamentid={this.props.tournamentIds[i]}/>)}
            </div>
        )
    }
}

export default TournamentStatsGrid