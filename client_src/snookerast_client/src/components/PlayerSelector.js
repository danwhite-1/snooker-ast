import { Component } from "react";
import DropDown from "./DropDown";
import PlayerStats from "./PlayerStats";

class PlayerSelector extends Component {
    constructor(props) {
        super(props)
        this.state = {
            playerid : ""
        }
    }

    onDDChange = (dropDownValue) => {
        const selected = this.props.players_list.find(player => player.playername === dropDownValue);
        this.setState({ playerid : selected.playerwstid });
        this.props.onDDChange(selected, this.props.id);
    }

    render() {
        return (
            <div className="SelectorDiv">
                <DropDown className="DropDown"
                    id={this.props.id}
                    onDDChange={this.onDDChange}
                    options={this.props.options}
                    defaultValue={this.props.defaultValue}
                ></DropDown>
                <PlayerStats playerid={this.state.playerid}></PlayerStats>
            </div>
        )
    }
}

export default PlayerSelector
