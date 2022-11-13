import { Component } from "react";

class TournamentSearchButton extends Component {

    render() {
        return (
            <div>
                <button onClick={this.props.onButtonPress}>Search</button>
            </div>
        )
    }
}

export default TournamentSearchButton