import { Component } from "react";

class TournamentStatsTitles extends Component {
    render() {
        return (
            <div className="statTitleDiv">
                <p className="statPSingleLine">Overall Average AST: </p>
                <p className="statPSingleLine">Average Winning AST: </p>
                <p className="statPSingleLine">Average Losing AST: </p>
                <p className="statTitlePTrebleLine">Fastest Match: </p>
                <p className="statTitlePTrebleLine">Slowest Match: </p>
            </div>
        )
    }
}

export default TournamentStatsTitles