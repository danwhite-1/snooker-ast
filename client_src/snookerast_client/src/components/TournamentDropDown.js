import { Component } from "react";
import DropdownList from "react-widgets/DropdownList";
import "react-widgets/styles.css";

class TournamentDropDown extends Component {
    constructor(props) {
        super(props)
        this.state = {
            options: this.props.tournaments,
            selected: "placeholder"
        }
    }

    // TODO: Move to newer version of this hook
    // This is required to allow the first dropdown to populate
    UNSAFE_componentWillReceiveProps (nextProps) {
        this.setState({options : nextProps.tournaments});
    }

    render() {
        return (
            <div className="TournamentDropDownDiv">
                <DropdownList
                    defaultValue="Select a tournament"
                    data={this.state.options}
                    onChange={selected => this.props.onDDChange(selected, this.props.id)}
                />
            </div>
        )
    }
}

export default TournamentDropDown