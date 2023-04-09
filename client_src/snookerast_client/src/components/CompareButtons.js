import { Component } from "react";

class CompareButtons extends Component {
    isDisabled = (type) => {
        if (type === "+" && this.props.compareNo === 4) return true;
        if (type === "-" && this.props.compareNo === 1) return true;
        return false;
    }

    changeNoToCompare = (change) => {
        if (change > 0) {
            this.props.handleNoToCompareChange(this.props.compareNo + change);
        } else {
            this.props.handleNoToCompareChange(this.props.compareNo + change);
        }
    }

    render() {
        return (
            <div className="CompareButtonDiv">
                <button className="CompareButton" disabled={this.isDisabled("+")} onClick={() => {this.changeNoToCompare(1)}}>+</button>
                <button className="CompareButton" disabled={this.isDisabled("-")} onClick={() => {this.changeNoToCompare(-1)}}>-</button>
            </div>
        )
    }
}

export default CompareButtons