import { Component } from "react";

class PlayerStatsTitles extends Component {
    render() {
        if (!this.props.render) {
            return (
                <div className="statTitleDiv" style={{width: "40px", height: "0px"}}/>
            )
        }

        return (
            <div className="statTitleDiv" style={{width: "240px", height: `${this.props.height}px`}}>
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