import { Component } from "react";
import TournamentDropDown from "./TournamentDropDown";
import TournamentLineChart from "./TournamentLineChart";

class TournamentSelect extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tournament_list : [],
            tournament_list_names : [],
            chart_data : [],
            noOfTournamentsToCompare : 1,
            tournamentNamesToCompare : []
        };
    }

    componentDidMount() {
        console.log("got here");
        const search_url = "/api/tournaments";
        fetch(search_url)
            .then(res => res.json())
            .then(tournamentData => {
                if (!tournamentData[0].error) {
                    this.setState({ 
                        tournament_list: tournamentData,
                        tournament_list_names : [] 
                    });

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
        const selected = this.state.tournament_list.find(tournament => tournament.tournamentname === dropDownValue);
        const search_url = "/api/tournamentdata?action=roundavg&tournament=" + selected.tournamentid;

        fetch(search_url)
            .then(res => res.json())
            .then(tournamentData => {
                if (!tournamentData[0].error) {
                    let rtnData = [];
                    let oldDataKey = "";
                    if (this.state.tournamentNamesToCompare.length >= DDkey) {
                        oldDataKey = this.state.tournamentNamesToCompare[DDkey]
                    }

                    this.state.chart_data.forEach(function (arrayItem) {
                        if (oldDataKey in arrayItem) {
                            delete arrayItem[oldDataKey];
                        }
                        if (Object.keys(arrayItem).length !== 1) {
                            rtnData.push(arrayItem);
                        }
                    });

                    const newData = tournamentData[0];
                    for (let r in newData) {
                        if (rtnData.find(round => round.round === r)) {
                            rtnData.find(round => round.round === r)[dropDownValue] = newData[r]
                        } else {
                            if (r !== "not found") {
                                let obj = { round : r};
                                obj[dropDownValue] = newData[r];
                                rtnData.push(obj);
                            }
                        }
                    }

                    let tNames = this.state.tournamentNamesToCompare;
                    if (tNames[DDkey] !== "undefined") {
                        tNames[DDkey] = dropDownValue;
                    }

                    this.setState({
                        chart_data : this.sortRounds(rtnData),
                        tournamentNamesToCompare : tNames
                    });

                } else {
                    alert("Tournament " + selected.tournamentid + " doesn't exist. Error: " + tournamentData[0].e_msg);
                }
            })
            .catch(error => alert("An error occured: " + error));
    }

    changeNoToCompare = (change) => {
        const min = 1;
        const max = 4;
        const newVal = this.state.noOfTournamentsToCompare + change;
        if (newVal < min || newVal > max) return;

        if (change > 0) {
            this.setState({
                noOfTournamentsToCompare : newVal
            })
            return;
        }

        let tNames = this.state.tournamentNamesToCompare;
        tNames.pop();
        this.setState({
            noOfTournamentsToCompare : newVal,
            tournamentNamesToCompare : tNames
        })
    }

    isDisabled = (type) => {
        if (type == "+" && this.state.noOfTournamentsToCompare == 4) return true
        if (type == "-" && this.state.noOfTournamentsToCompare == 1) return true
    }

    render() {
        return (
            <div className="TournamentDiv">
                <div className="TournamentDropDownGridDiv">
                    {Array(this.state.noOfTournamentsToCompare).fill(true).map((_, i) => <TournamentDropDown 
                                                                                            key={i} id={i} className="TournamentDropDown"
                                                                                            onDDChange={this.handleDropDownChange}
                                                                                            tournaments={this.state.tournament_list_names}
                                                                                            />)}
                    <div className="CompareButtonDiv">
                        <button className="CompareButton" disabled={this.isDisabled("+")} onClick={() => {this.changeNoToCompare(1)}}>+</button>
                        <button className="CompareButton" disabled={this.isDisabled("-")} onClick={() => {this.changeNoToCompare(-1)}}>-</button>
                    </div>
                </div>
                <TournamentLineChart data={this.state.chart_data} tournNames={this.state.tournamentNamesToCompare}/>
            </div>
        )
    }
}

export default TournamentSelect;