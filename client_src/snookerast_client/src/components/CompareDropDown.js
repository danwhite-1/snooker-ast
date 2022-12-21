import { Component } from "react";
import DropdownList from "react-widgets/DropdownList";
import "react-widgets/styles.css";

class CompareDropDown extends Component {
    constructor(props) {
        super(props)
        this.state = {
            options: ["one", "two", "three", "four"],
            selected: "placeholder"
        }
    }

    render() {
        return (
            <div className="CompareDropDownDiv">
                <DropdownList
                    defaultValue="one"
                    data={this.state.options}
                    onChange={this.props.onDDChange}
                />
            </div>
        )
    }
}

export default CompareDropDown