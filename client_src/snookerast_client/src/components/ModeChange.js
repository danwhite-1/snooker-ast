import { Component } from "react";

class ModeChange extends Component {
    constructor(props) {
        super(props)
    }

    changeMode = () => {
        let newMode = this.props.mode;
        if (newMode === "T") {
            this.props.handleModeChange("M");
            return;
        }
        this.props.handleModeChange("T")
    }

    render() {
        return (
            <div className="ModeChangeDiv">
                <button onClick={this.changeMode}>Mode:{this.props.mode}</button>
            </div>
        )
    }
}

export default ModeChange