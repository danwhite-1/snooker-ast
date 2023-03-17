import { Component } from "react";
import TournamentStats from "./TournamentStats";

class TournamentStatsGrid extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        if(!this.props.tournamentIds) {
            return (
                <div />
            )
        }

        return (
            <div className="TournamentStatsGridDiv">
                {Array(this.props.tournamentIds.length).fill(0).map((_, i) => <TournamentStats key={i} tournamentid={this.props.tournamentIds[i]}/>)}
            </div>
        )
    }
}

export default TournamentStatsGrid