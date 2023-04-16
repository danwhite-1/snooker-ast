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
            ddGridDivHeight : 50,
            render_stats : false,
        }
    }

    onDDChange = (selection, id) => {
        if (this.state.ddGridDivHeight === 50) {
            if (this.props.mode === "T") this.setState({ ddGridDivHeight : 300 });
            else this.setState({ ddGridDivHeight : 350 })

            this.setState({ render_stats : true })
        }
        this.props.handleChange(selection, id);
    }

    render() {
        let selector_jsx, statTitle_jsx;
        if (this.props.mode === "T") {
            statTitle_jsx = ( <TournamentStatsTitles render={this.state.render_stats} height={this.state.ddGridDivHeight} /> );
            selector_jsx = (
                Array(this.props.compareNo).fill(0).map((_, i) => <TournamentSelector className="DropDown"
                                                                                      key={i} id={i}
                                                                                      onDDChange={this.onDDChange}
                                                                                      tournament_list={this.props.tournament_list}
                                                                                      options={this.props.list_names}
                                                                                      defaultValue={this.props.def_val}
                                                                  />)
            );
        }
        else {
            statTitle_jsx = ( <PlayerStatsTitles render={this.state.render_stats} height={this.state.ddGridDivHeight} /> );
            selector_jsx = (
                Array(this.props.compareNo).fill(0).map((_, i) => <PlayerSelector className="DropDown"
                                                                                  key={i} id={i}
                                                                                  onDDChange={this.onDDChange}
                                                                                  players_list={this.props.players_list}
                                                                                  options={this.props.list_names}
                                                                                  defaultValue={this.props.def_val}
                                                                  />)
            );
        }
    
        return (
            <div className="DropDownGridDiv" style={{height: `${this.state.ddGridDivHeight}px`}}>
                { statTitle_jsx }
                { selector_jsx }
                <CompareButtons compareNo={this.props.compareNo} handleNoToCompareChange={this.props.handleNoToCompareChange} />
            </div>
        )
    }
}

export default DropdownGrid