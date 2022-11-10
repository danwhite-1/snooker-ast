import { Component } from "react";
import TournamentSearchBox from "./TournamentSearchBox";

class TournamentSelect extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tournaments : ""
        };
    }

    render() {
        return (
            <div>
                <TournamentSearchBox />
                <h1>Tournament name = {this.state.tournaments}</h1>
            </div>
        )
    }
}

export default TournamentSelect;