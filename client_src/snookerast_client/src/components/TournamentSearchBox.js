import { Component } from "react";

class TournamentSearchBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tournaments1 : ""
        };
    }

    submitFunction = () => {
        fetch('http://127.0.0.1:8000/tournament/14564')
            .then(res => res.json())
            .then(tournamentData => {
                this.setState({tournaments1: tournamentData[0].tournamentname})
            });
    }

    render() {
        return (
            <div>
                <br></br>
                <br></br>
                <label>Enter tournament number here: </label>
                <input type="text" className="tournamentSearchBoxTextbox"/>
                <button type="button" onClick={this.submitFunction}>Search</button>
            </div>
        )
    }
}

export default TournamentSearchBox