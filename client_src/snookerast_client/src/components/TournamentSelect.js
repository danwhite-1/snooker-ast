import { Component } from "react";
import CompareDropDown from "./CompareDropDown";
import TournamentDropDown from "./TournamentDropDown";
import TournamentLineChart from "./TournamentLineChart";

class TournamentSelect extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tournament_name : "",
            tournament_id : "",
            tournament_round_averages : {},
            tournament_list : [],
            placeholder_data : []
        };
    }

    componentDidMount() {
        const search_url = "/api/tournaments";
        fetch(search_url)
            .then(res => res.json())
            .then(tournamentData => {
                if (!tournamentData[0].error) {
                    this.setState({tournament_list: tournamentData});
                } else {
                    // Correct this error message
                    alert("Error retriving tournaments. Error: " + tournamentData[0].e_msg);
                }
            })
            .catch(error => alert("An error occured: " + error));
    }

    validateTournamentId = () => {
        if (this.state.tournament_id.length === 5 && !isNaN(this.state.tournament_id)) {
            return true;
        }
    }

    handleSearchBoxChange = (sb_value) => {
        this.setState({
            tournament_id : sb_value
        })
    }

    handleDropDownChange = (dropDownValue) => {
        const selected = this.state.tournament_list.find(tournament => tournament.tournamentname === dropDownValue);

        let search_url = "/api/tournament/" + selected.tournamentid;
        fetch(search_url)
            .then(res => res.json())
            .then(tournamentData => {
                if (!tournamentData[0].error) {
                    this.setState({tournament_name: tournamentData[0].tournamentname})
                } else {
                    alert("Tournament " + selected.tournamentid + " doesn't exist. Error: " + tournamentData[0].e_msg);
                }
            })
            .catch(error => alert("An error occured: " + error));

        search_url = "/api/tournamentdata?action=roundavg&tournament=" + selected.tournamentid;
        fetch(search_url)
            .then(res => res.json())
            .then(tournamentData => {
                if (!tournamentData[0].error) {
                    this.setState({tournament_round_averages: tournamentData[0]});
                    let newData = tournamentData[0];
                    let rtnData = []

                    for (let r in newData) {
                        if (r !== "not found") {
                            rtnData.push({
                                round : r,
                                avg_ast : newData[r]
                            });
                        }
                    }

                    this.setState({ placeholder_data : rtnData });
                } else {
                    alert("Tournament " + selected.tournamentid + " doesn't exist. Error: " + tournamentData[0].e_msg);
                }
            })
            .catch(error => alert("An error occured: " + error));
    }

    handleCompareDropDownChange = (dropDownValue) => {
        console.log("Compare drop down changed. new val = " + dropDownValue);
    }

    render() {
        return (
            <div className="TournamentSearchBoxDiv">
                <CompareDropDown className="CompareDropDown" onDDChange={this.handleCompareDropDownChange}/>
                <TournamentDropDown className="TournamentDropDown" onDDChange={this.handleDropDownChange} tournaments={this.state.tournament_list}/>
                <TournamentLineChart data={this.state.placeholder_data}/>
            </div>
        )
    }
}

export default TournamentSelect;