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

    handleSearchBoxChange = (sb_value) => {
        this.setState({
            tournament_id : sb_value
        })
    }

    handleSearchButtonPress = () => {
        // TODO investigate using a proxy with axios to prevent needing whole URL, or custom route function
        const search_url = "http://127.0.0.1:8000/tournament/" + this.state.tournament_id;
        // TODO improve error handling if promise returns error
        fetch(search_url)
            .then(res => res.json())
            .then(tournamentData => {
                if (!tournamentData[0].error) {
                    this.setState({tournament_name: tournamentData[0].tournamentname})
                } else {
                    alert("Tournament " + this.state.tournament_id + " doesn't exist");
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