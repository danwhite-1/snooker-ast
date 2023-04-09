import { Component } from "react";
import CompareButtons from "./CompareButtons";
import PlayerSelector from "./PlayerSelector";
import TournamentSelector from "./TournamentSelector";

class DropdownGrid extends Component {
    constructor(props) {
        super(props)
        this.state = {
            key_modifier : 0
        }
    }

    componentDidMount() {
        // Modify the key to force a re-render on a mode change
        if (this.props.mode === "T") {
            this.setState({ key_modifier : 0 });
        } else {
            this.setState({ key_modifier : 10 });
        }
    }

    render() {
        if (this.props.mode === "T") {
            return (
                <div className="DropDownGridDiv">
                    <div className="statTitleDiv">
                        <p className="statPSingleLine">Overall Average AST: </p>
                        <p className="statPSingleLine">Average Winning AST: </p>
                        <p className="statPSingleLine">Average Losing AST: </p>
                        <p className="statTitlePTrebleLine">Fastest Match: </p>
                        <p className="statTitlePTrebleLine">Slowest Match: </p>
                    </div>
                    {Array(this.props.compareNo).fill(0).map((_, i) => <TournamentSelector className="DropDown"
                                                                            key={i+this.state.key_modifier} id={i}
                                                                            onDDChange={this.props.handleChange}
                                                                            tournament_list={this.props.tournament_list}
                                                                            options={this.props.list_names}
                                                                            defaultValue={this.props.def_val}
                                                                        />)}
                    <CompareButtons compareNo={this.props.compareNo} handleNoToCompareChange={this.props.handleNoToCompareChange} />
                </div>
            )
        }

        return (
            <div className="DropDownGridDiv">
                <div className="statTitleDiv">
                    <p className="statPSingleLine">Overall Average AST: </p>
                    <p className="statTitlePDualLine">Fastest Tournament: </p>
                    <p className="statTitlePDualLine">Slowest Tournament: </p>
                    <p className="statTitlePTrebleLine">Fastest Match: </p>
                    <p className="statTitlePTrebleLine">Slowest Match: </p>
                </div>
                {Array(this.props.compareNo).fill(0).map((_, i) => <PlayerSelector className="DropDown"
                                                                        key={i+this.state.key_modifier} id={i}
                                                                        onDDChange={this.props.handleChange}
                                                                        players_list={this.props.players_list}
                                                                        options={this.props.list_names}
                                                                        defaultValue={this.props.def_val}
                                                                    />)}
                <CompareButtons compareNo={this.props.compareNo} handleNoToCompareChange={this.props.handleNoToCompareChange} />
            </div>
        )
    }
}

export default DropdownGrid