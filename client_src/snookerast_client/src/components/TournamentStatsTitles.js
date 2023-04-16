import { Component } from "react";

class TournamentStatsTitles extends Component {
    render() {
        if (!this.props.render) {
            return (
                <div className="statTitleDiv" style={{width: "40px", height: "0px"}}/>
            )
        }

        return (
            <div className="statTitleDiv" style={{width: "240px", height: `${this.props.height}px`}}>
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