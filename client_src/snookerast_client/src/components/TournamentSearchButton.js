import { Component } from "react";

class TournamentSearchButton extends Component {

    render() {
        return (
            <div className="TournamentSearchButtonDiv">
                <button className="TournamentSearchButton" onClick={this.props.onButtonPress}>Search</button>
            </div>
        )
    }
}

export default TournamentSearchButton