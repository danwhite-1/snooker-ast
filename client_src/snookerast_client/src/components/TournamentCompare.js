import { Component } from "react";
import CustomLineChart from "./CustomLineChart";
import DropdownGrid from "./DropdownGrid";

class TournamentCompare extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tournament_list : [],
            tournament_list_names : [],
            tournament_chart_data : [],
            tournamentNamesToCompare : [],
            tournamentIdsToCompare : [],
            we_have_data : false,
            selection_made : false,
            noToCompare : 1,
        };
    }

    async componentDidMount() {
        await this.loadData();
        this.setState({ we_have_data : true });
    }

    loadData = async () => {
        const search_url = "/api/tournaments";
        await fetch(search_url)
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
            const x = a["round"];
            const y = b["round"];
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
            return 1; // Should never get here
        });
    }

    handleTournamentDropDownChange = (selection, DDkey) => {
        const search_url = "/api/tournamentdata?action=roundavg&tournament=" + selection.tournamentid;

        fetch(search_url)
            .then(res => res.json())
            .then(tournamentData => {
                if (!tournamentData[0].error) {
                    let rtnData = [];
                    let oldDataKey = "";
                    if (this.state.tournamentNamesToCompare.length >= DDkey) {
                        oldDataKey = this.state.tournamentNamesToCompare[DDkey];
                    }

                    this.state.tournament_chart_data.forEach(function (arrayItem) {
                        if (Object.keys(arrayItem).length !== 1) {
                            rtnData.push(arrayItem);
                        }
                    });

                    const newData = tournamentData[0];
                    for (let r in newData) {
                        if (rtnData.find(round => round.round === r)) {
                            rtnData.find(round => round.round === r)[selection.tournamentname] = newData[r]
                        } else {
                            if (r !== "not found") {
                                let obj = { round : r};
                                obj[selection.tournamentname] = newData[r];
                                rtnData.push(obj);
                            }
                        }
                    }

                    let tNames = this.state.tournamentNamesToCompare;
                    if (tNames[DDkey] !== "undefined") {
                        tNames[DDkey] = selection.tournamentname;
                    }

                    let tIds = this.state.tournamentIdsToCompare;
                    if (tIds[DDkey] !== "undefined") {
                        tIds[DDkey] = selection.tournamentid;
                    }

                    let s_m = tNames.length ? true : false;

                    this.setState({
                        tournament_chart_data : this.sortRounds(rtnData),
                        tournamentNamesToCompare : tNames,
                        tournamentIdsToCompare : tIds,
                        selection_made : s_m
                    });
                } else {
                    alert("Tournament " + selection.tournamentid + " doesn't exist. Error: " + tournamentData[0].e_msg);
                }
            })
            .catch(error => alert("An error occured: " + error));
    }

    handleNoToCompareChange = (newVal) => {
        if (newVal > this.state.noToCompare) {
            this.setState({ noToCompare : newVal});
            return;
        }

        // if reducing the number to compare, remove the last item from chart data
        let tNames = this.state.tournamentNamesToCompare;
        tNames.pop();

        let tIds = this.state.tournamentIdsToCompare;
        tIds.pop();

        this.setState({
            noToCompare : newVal,
            tournamentNamesToCompare : tNames,
            tournamentIdsToCompare : tIds
        })
    }

    render() {
        if (!this.state.we_have_data) {
            return <div />
        }

        return (
            <div className="TournamentDiv">
                <DropdownGrid
                    key="0"
                    handleChange={this.handleTournamentDropDownChange}
                    tournament_list={this.state.tournament_list}
                    list_names={this.state.tournament_list_names}
                    handleNoToCompareChange={this.handleNoToCompareChange}
                    compareNo={this.state.noToCompare}
                    def_val="Select a Tournament"
                    selection_made={this.state.selection_made}
                    mode="T"
                />
                <CustomLineChart data={this.state.tournament_chart_data} tournNames={this.state.tournamentNamesToCompare} dataKey="round" />
            </div>
        )
    }
}

export default TournamentCompare
