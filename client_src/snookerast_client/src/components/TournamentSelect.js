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
            tournament_list_names : [],
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

                    // strip out tourn names for drop downs
                    for (let i = 0; i < tournamentData.length; i++) {
                        this.setState(prev => ({tournament_list_names : [...prev.tournament_list_names, Object.values(tournamentData[i])[1]]}));
                    }
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

    calcDataKey = (id) => {
        // duplicate logic from TournamentLineChart.js
        const dataKeyBase = "avg_ast";
        const dataKeyMap = {
        "0" : dataKeyBase + "1",
        "1" : dataKeyBase + "2",
        "2" : dataKeyBase + "3",
        "3" : dataKeyBase + "4",
        }

        return dataKeyMap[id.toString()]
    }

    sortRounds (array) {
        return array.sort(function(a, b) {
            var x = a["round"];
            var y = b["round"];
            if (!x.includes("final") && !y.includes("final")) {
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            } else if (x.includes("final") && !y.includes("final")) {
                return 1;
            } else if (!x.includes("final") && y.includes("final")) {
                return -1;
            } else if (x.includes("semi") && y !== "final") {
                return 1;
            } else if (y.includes("semi") && x !== "final") {
                return -1;
            } else if (x.includes("quarter") && !y.includes("final")) {
                return 1;
            } else if (y.includes("quarter") && !x.includes("final")) {
                return -1;
            }
        });
    }

    handleDropDownChange = (dropDownValue, DDkey) => {
        if (dropDownValue === "loading") {
            return;
        }
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

        const dataKey = this.calcDataKey(DDkey);

        search_url = "/api/tournamentdata?action=roundavg&tournament=" + selected.tournamentid;
        fetch(search_url)
            .then(res => res.json())
            .then(tournamentData => {
                if (!tournamentData[0].error) {
                    this.setState({tournament_round_averages: tournamentData[0]});
                    const newData = tournamentData[0];
                    let rtnData = []

                    if (DDkey === 0) {
                        for (let r in newData) {
                            if (r !== "not found") {
                                let obj = { round : r};
                                obj[dataKey] = newData[r];
                                rtnData.push(obj);
                            }
                        }
                        this.setState({ chart_data : rtnData });
                        return;
                    }

                    rtnData = this.state.chart_data;
                    for (let r in newData) {
                        if (rtnData.find(round => round.round === r)) {
                            rtnData.find(round => round.round === r)[dataKey] = newData[r]
                        } else {
                            if (r !== "not found") {
                                let obj = { round : r};
                                obj[dataKey] = newData[r];
                                rtnData.push(obj);
                            }
                        }
                    }
                    rtnData = this.sortRounds(rtnData);

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
                                                                                            key={i} id={i} className="TournamentDropDown"
                                                                                            onDDChange={this.handleDropDownChange}
                                                                                            tournaments={this.state.tournament_list_names}
                                                                                        />)}
                </div>
                <TournamentLineChart data={this.state.chart_data} noOfLines={this.state.tournaments_to_compare}/>
            </div>
        )
    }
}

export default TournamentSelect;