import { Component } from "react";
import TournamentSearchBox from "./TournamentSearchBox";
import TournamentSearchButton from "./TournamentSearchButton";

class TournamentSelect extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tournament_name : "",
            tournament_id : "",
            tournament_round_averages : []
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

        let search_url = "/api/tournament/" + this.state.tournament_id;
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

        search_url = "/api/tournamentdata?action=roundavg&tournament=" + this.state.tournament_id;
        fetch(search_url)
            .then(res => res.json())
            .then(tournamentData => {
                if (!tournamentData[0].error) {
                    this.setState({tournament_round_averages: [...this.state.tournament_round_averages, tournamentData]})
                } else {
                    alert("Tournament " + this.state.tournament_id + " doesn't exist. Error: " + tournamentData[0].e_msg);
                }
            })
            .catch(error => alert("An error occured: " + error));
    }

    render() {
        return (
            <div className="TournamentSearchBoxDiv">
                <h2 className="TournamentNameHeader">Tournament name = {this.state.tournament_name}</h2>
                <TournamentSearchBox onSearchBoxChange={this.handleSearchBoxChange}/>
                <TournamentSearchButton onButtonPress={this.handleSearchButtonPress} />
                <h3 className="TournamentNameHeader">{this.state.tournament_round_averages.join(", ")}</h3>
            </div>
        )
    }
}

export default TournamentSelect;