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

    translateStringToInt = (valAsString) => {
        const numToIntDict = {
            'one' : 1,
            'two' : 2,
            'three': 3,
            'four' : 4
        }

        this.props.onDDChange(numToIntDict[valAsString]);
    }

    render() {
        return (
            <div className="CompareDropDownDiv">
                <DropdownList
                    defaultValue="one"
                    data={this.state.options}
                    onChange={this.translateStringToInt}
                />
            </div>
        )
    }
}

export default CompareDropDown