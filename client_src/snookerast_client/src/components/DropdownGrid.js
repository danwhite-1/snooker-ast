import { Component } from "react";
import CompareButtons from "./CompareButtons";
import DropDown from "./DropDown";

class DropdownGrid extends Component {
    constructor(props) {
        super(props)
        this.state = {
            key_modifier : 0
        }
    }

    componentDidMount() {
        // Modify the key to force a re-render on a mode change
        if (this.props.mode == "T") {
            this.setState({ key_modifier : 0 });
        } else {
            this.setState({ key_modifier : 10 });
        }
    }

    render() {
        return (
            <div className="DropDownGridDiv">
                {Array(this.props.compareNo).fill(0).map((_, i) => <DropDown
                                                                        key={i+this.state.key_modifier} id={i} className="DropDown"
                                                                        onDDChange={this.props.handleChange}
                                                                        options={this.props.list_names}
                                                                        defaultValue={this.props.def_val}
                                                                    />)}
                <CompareButtons compareNo={this.props.compareNo} handleNoToCompareChange={this.props.handleNoToCompareChange} />
            </div>
        )
    }
}

export default DropdownGrid