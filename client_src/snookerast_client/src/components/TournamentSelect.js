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
            chart_data : [],
            tournaments_to_compare : "one"
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

                    this.setState({ chart_data : rtnData });
                } else {
                    alert("Tournament " + selected.tournamentid + " doesn't exist. Error: " + tournamentData[0].e_msg);
                }
            })
            .catch(error => alert("An error occured: " + error));
    }

    handleCompareDropDownChange = (dropDownValue) => {
        this.setState({
            tournaments_to_compare : dropDownValue
        })
    }

    render() {
        return (
            <div className="TournamentSearchBoxDiv">
                <CompareDropDown className="CompareDropDown" onDDChange={this.handleCompareDropDownChange}/>
                <div className="TournamentDropDownGridDiv">
                    {Array(this.state.tournaments_to_compare).fill(true).map((_, i) => <TournamentDropDown 
                                                                                            key={i} className="TournamentDropDown"
                                                                                            onDDChange={this.handleDropDownChange}
                                                                                            tournaments={this.state.tournament_list}
                                                                                        />)}
                </div>
                <TournamentLineChart data={this.state.chart_data}/>
            </div>
        )
    }
}

export default TournamentSelect;