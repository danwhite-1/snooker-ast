import { Component } from "react";

class TournamentSearchBox extends Component {

    handleChange = (e) => {
        this.props.onSearchBoxChange(e.target.value);
    }

    render() {
        return (
            <div className="TournamentSearchBoxDiv">
                <label>Enter tournament number here: </label>
                <input type="text" className="tournamentSearchBoxTextbox rounded" onChange={this.handleChange.bind(this)}/>
            </div>
        )
    }
}

export default TournamentSearchBox