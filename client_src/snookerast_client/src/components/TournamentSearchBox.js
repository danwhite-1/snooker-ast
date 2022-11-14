import { Component } from "react";

class TournamentSearchBox extends Component {

    handleChange = (e) => {
        console.log("TournamentSearchBox:handleChange e.target.value = " + e.target.value);
        this.props.onSearchBoxChange(e.target.value);
    }

    render() {
        return (
            <div className="TournamentSearchBoxDiv">
                <label>Enter tournament number here: </label>
                <input type="text" className="tournamentSearchBoxTextbox" onChange={this.handleChange.bind(this)}/>
            </div>
        )
    }
}

export default TournamentSearchBox