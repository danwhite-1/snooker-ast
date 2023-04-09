import { Component } from "react";

class PlayerStatsTitles extends Component {
    render() {
        return (
            <div className="statTitleDiv">
                <p className="statPSingleLine">Overall Average AST: </p>
                <p className="statTitlePDualLine">Fastest Tournament: </p>
                <p className="statTitlePDualLine">Slowest Tournament: </p>
                <p className="statTitlePTrebleLine">Fastest Match: </p>
                <p className="statTitlePTrebleLine">Slowest Match: </p>
            </div>
        )
    }
}

export default PlayerStatsTitles