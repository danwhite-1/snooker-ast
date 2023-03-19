import { Component } from "react";
import DropDown from "./DropDown";
import TournamentStats from "./TournamentStats";

class TournamentSelector extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tournamentid : ""
        }
    }

    onDDChange = (dropDownValue) => {
        const selected = this.props.tournament_list.find(tournament => tournament.tournamentname === dropDownValue);
        this.setState({ tournamentid : selected.tournamentid });
        this.props.onDDChange(selected, this.props.id);
    }

    render() {
        return (
            <div className="TournamentSelectorDiv">
                <DropDown className="DropDown"
                    id={this.props.id}
                    onDDChange={this.onDDChange}
                    options={this.props.options}
                    defaultValue={this.props.defaultValue}
                ></DropDown>
                <TournamentStats tournamentid={this.state.tournamentid}></TournamentStats>
            </div>
        )
    }
}

export default TournamentSelector
