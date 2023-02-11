import { Component } from "react";
import DropdownList from "react-widgets/DropdownList";
import "react-widgets/styles.css";

class TournamentDropDown extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value : this.props.defaultValue,
            options : this.props.options
        }
    }

    handleChange = (selected) => {
        this.setState({ value : selected });
        this.props.onDDChange(selected, this.props.id);
    }

    render() {
        return (
            <div className="DropDownDiv">
                <DropdownList
                    value={this.state.value}
                    data={this.state.options}
                    onChange={selected => this.handleChange(selected)}
                />
            </div>
        )
    }
}

export default TournamentDropDown