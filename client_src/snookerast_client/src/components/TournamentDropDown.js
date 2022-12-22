import { Component } from "react";
import DropdownList from "react-widgets/DropdownList";
import "react-widgets/styles.css";

class TournamentDropDown extends Component {
    constructor(props) {
        super(props)
        this.state = {
            options: ["loading"],
            selected: "placeholder"
        }
    }

    // TODO: Move to newer version of this hook
    // BUG! Extra dropdowns only populate after there has been
    // a selection in the first one
    UNSAFE_componentWillReceiveProps (nextProps) {
        if (nextProps.tournaments !== this.props.options) {
            this.setState({options : []});
            for (let i = 0; i < nextProps.tournaments.length; i++) {
                this.setState(prev => ({options : [...prev.options, Object.values(nextProps.tournaments[i])[1]]}));
            }
            return true;
        } else {
            return false;
        }
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