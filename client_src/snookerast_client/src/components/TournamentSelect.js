import { Component } from "react";
import TournamentDropDown from "./TournamentDropDown";

class TournamentSelect extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tournament_name : "",
            tournament_id : "",
            tournament_round_averages : {},
            tournament_list : []
        };
    }

    componentDidMount() {
        const search_url = "/api/tournaments";
        fetch(search_url)
            .then(res => res.json())
            .then(tournamentData => {
                if (!tournamentData[0].error) {
                    this.setState({tournament_list: tournamentData});
                } else {
                    // Correct this error message
                    alert("Error retriving tournaments. Error: " + tournamentData[0].e_msg);
                }
            })
            .catch(error => alert("An error occured: " + error));
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

    handleDropDownChange = (dropDownValue) => {
        const selected = this.state.tournament_list.find(tournament => tournament.tournamentname === dropDownValue);

        let search_url = "/api/tournament/" + selected.tournamentid;
        fetch(search_url)
            .then(res => res.json())
            .then(tournamentData => {
                if (!tournamentData[0].error) {
                    this.setState({tournament_name: tournamentData[0].tournamentname})
                } else {
                    alert("Tournament " + selected.tournamentid + " doesn't exist. Error: " + tournamentData[0].e_msg);
                }
            })
            .catch(error => alert("An error occured: " + error));

        search_url = "/api/tournamentdata?action=roundavg&tournament=" + selected.tournamentid;
        fetch(search_url)
            .then(res => res.json())
            .then(tournamentData => {
                if (!tournamentData[0].error) {
                    this.setState({tournament_round_averages: tournamentData[0]});
                } else {
                    alert("Tournament " + selected.tournamentid + " doesn't exist. Error: " + tournamentData[0].e_msg);
                }
            })
            .catch(error => alert("An error occured: " + error));
    }

    render() {
        return (
            <div className="TournamentSearchBoxDiv">
                <TournamentDropDown className="TournamentDropDown" onDDChange={this.handleDropDownChange} tournaments={this.state.tournament_list}/>
                <h2 className="TournamentNameHeader">Tournament name = {this.state.tournament_name}</h2>
                <pre>{JSON.stringify(this.state.tournament_round_averages, null, 2) }</pre>
            </div>
        )
    }
}

export default TournamentSelect;