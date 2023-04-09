import { Component } from "react";
import CompareButtons from "./CompareButtons";
import PlayerSelector from "./PlayerSelector";
import TournamentSelector from "./TournamentSelector";
import TournamentStatsTitles from "./TournamentStatsTitles";
import PlayerStatsTitles from "./PlayerStatsTitles";

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
                    { this.props.selection_made ? <TournamentStatsTitles /> : <div style={{minWidth: "220px", float: "left"}}>&nbsp;</div> }
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
                { this.props.selection_made ? <PlayerStatsTitles /> : <div style={{minWidth: "220px", float: "left"}}>&nbsp;</div> }
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