import { Component } from "react";
import ModeChange from "./ModeChange";
import TournamentCompare from "./TournamentCompare";
import PlayerCompare from "./PlayerCompare";

class SnookerAST extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mode : "T"
        };
    }

    handleModeChange = (newMode) => {
        this.setState({ mode: newMode });
    }

    render() {
        if (this.state.mode === "T") {
            return (
                <div>
                    <ModeChange mode={this.state.mode} handleModeChange={this.handleModeChange} />
                    <TournamentCompare />
                </div>
            )
        } else {
            return (
                <div>
                    <ModeChange mode={this.state.mode} handleModeChange={this.handleModeChange} />
                    <PlayerCompare />
                </div>
            )
        }
    }
}

export default SnookerAST;
