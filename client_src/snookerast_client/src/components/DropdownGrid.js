import { Component } from "react";
import CompareButtons from "./CompareButtons";
import TournamentDropDown from "./TournamentDropDown";

class DropdownGrid extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="DropDownGridDiv">
                {Array(this.props.compareNo).fill(0).map((_, i) => <TournamentDropDown
                                                                        key={i} id={i} className="DropDown"
                                                                        onDDChange={this.props.handleChange}
                                                                        options={this.props.list_names}
                                                                    />)}
                <CompareButtons compareNo={this.props.compareNo} handleNoToCompareChange={this.props.handleNoToCompareChange} />
            </div>
        )
    }
}

export default DropdownGrid