import { Component } from "react";
import TournamentSearchBox from "./TournamentSearchBox";
import TournamentSearchButton from "./TournamentSearchButton";

class TournamentSelect extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tournament_name : "",
            tournament_id : ""
        };
    }

    validateTournamentId = () => {
        if (this.state.tournament_id.length === 5 && !isNaN(this.state.tournament_id)) {
            return true;
        }
    }

    handleSearchBoxChange = (sb_value) => {
        this.setState({
            tournament_id : sb_value
        })
    }

    handleSearchButtonPress = () => {
        if (!this.validateTournamentId()) {
            alert("Tournament ID must be a number of 5 digits");
            return;
        }

        const search_url = "/api/tournament/" + this.state.tournament_id;
        fetch(search_url)
            .then(res => res.json())
            .then(tournamentData => {
                if (!tournamentData[0].error) {
                    this.setState({tournament_name: tournamentData[0].tournamentname})
                } else {
                    alert("Tournament " + this.state.tournament_id + " doesn't exist. Error: " + tournamentData[0].e_msg);
                }
            })
            .catch(error => alert("An error occured: " + error));
    }

    render() {
        return (
            <div>
                <TournamentSearchBox onSearchBoxChange={this.handleSearchBoxChange}/>
                <TournamentSearchButton onButtonPress={this.handleSearchButtonPress} />
                <h1>Tournament name = {this.state.tournament_name}</h1>
            </div>
        )
    }
}

export default TournamentSelect;