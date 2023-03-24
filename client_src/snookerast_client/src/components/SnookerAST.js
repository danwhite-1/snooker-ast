import { Component } from "react";
import DropdownGrid from "./DropdownGrid";
import ModeChange from "./ModeChange";
import CustomLineChart from "./CustomLineChart";

class SnookerAST extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tournament_list : [],
            tournament_list_names : [],
            tournament_chart_data : [],
            tournamentNamesToCompare : [],
            tournamentIdsToCompare : [],
            players_list : [],
            players_list_names : [],
            player_chart_data : [],
            playerNamesToCompare : [],
            noToCompare : 1,
            mode : "T",
            we_have_data : false
        };
    }

    async componentDidMount() {
        await this.loadData();
        this.setState({ we_have_data : true });
    }

    loadData = async () => {
        let search_url = "/api/tournaments";
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

        search_url = "/api/players";
        await fetch(search_url)
            .then(res => res.json())
            .then(playerData => {
                if (!playerData[0].error) {
                    this.setState({
                        players_list: playerData,
                        players_list_names : []
                    });

                    // strip out player names for drop downs
                    for (let i = 0; i < playerData.length; i++) {
                        this.setState(prev => ({players_list_names : [...prev.players_list_names, Object.values(playerData[i])[1]]}));
                    }
                } else {
                    // Correct this error message
                    alert("Error retriving players. Error: " + playerData[0].e_msg);
                }
            })
            .catch(error => alert("An error occured: " + error));

        return;
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
                        oldDataKey = this.state.tournamentNamesToCompare[DDkey]
                    }

                    this.state.tournament_chart_data.forEach(function (arrayItem) {
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

                    this.setState({
                        tournament_chart_data : this.sortRounds(rtnData),
                        tournamentNamesToCompare : tNames,
                        tournamentIdsToCompare : tIds
                    });
                } else {
                    alert("Tournament " + selection.tournamentid + " doesn't exist. Error: " + tournamentData[0].e_msg);
                }
            })
            .catch(error => alert("An error occured: " + error));
    }

    handlePlayerDropDownChange = (selection, DDkey) => {
        const search_url = "/api/playerdata?action=tournavg&player=" + selection.playerwstid;

        fetch(search_url)
            .then(res => res.json())
            .then(playerData => {
                if (!playerData[0].error) {
                    let rtnData = [];
                    let oldDataKey = "";
                    if (this.state.playerNamesToCompare.length >= DDkey) {
                        oldDataKey = this.state.playerNamesToCompare[DDkey]
                    }

                    this.state.player_chart_data.forEach(function (arrayItem) {
                        if (oldDataKey in arrayItem) {
                            delete arrayItem[oldDataKey];
                        }
                        if (Object.keys(arrayItem).length !== 1) {
                            rtnData.push(arrayItem);
                        }
                    });

                    const newData = playerData[0];
                    for (let t in newData) {
                        if (rtnData.find(tourn => tourn.tournid === t)) {
                            rtnData.find(tourn => tourn.tournid === t)[selection.playername] = newData[t]
                        } else {
                            let obj = { tournid : t};
                            obj[selection.playername] = newData[t];
                            rtnData.push(obj);
                        }
                    }

                    let pNames = this.state.playerNamesToCompare;
                    if (pNames[DDkey] !== "undefined") {
                        pNames[DDkey] = selection.playername;
                    }

                    this.setState({
                        player_chart_data : rtnData,
                        playerNamesToCompare : pNames
                    });
                } else {
                    alert("Tournament " + selection.tournamentid + " doesn't exist. Error: " + playerData[0].e_msg);
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
        if (this.state.mode === "T") {
            let tNames = this.state.tournamentNamesToCompare;
            tNames.pop();

            let tIds = this.state.tournamentIdsToCompare;
            tIds.pop();

            this.setState({
                noToCompare : newVal,
                tournamentNamesToCompare : tNames,
                tournamentIdsToCompare : tIds
            })
        } else {
            let pNames = this.state.playerNamesToCompare;
            pNames.pop();
            this.setState({
                noToCompare : newVal,
                playerNamesToCompare : pNames
            })
        }
    }

    handleModeChange = (newMode) => {
        this.setState({ mode: newMode, noToCompare : 1, tournament_chart_data : [], tournamentNamesToCompare : []});
    }

    render() {
        if (!this.state.we_have_data) {
            return <div />
        }

        if (this.state.mode === "T") {
            return (
                <div className="TournamentDiv">
                    <ModeChange mode={this.state.mode} handleModeChange={this.handleModeChange} />
                    <DropdownGrid
                        key="0"
                        handleChange={this.handleTournamentDropDownChange}
                        tournament_list={this.state.tournament_list}
                        list_names={this.state.tournament_list_names}
                        handleNoToCompareChange={this.handleNoToCompareChange}
                        compareNo={this.state.noToCompare}
                        def_val="Select a Tournament"
                        mode="T"
                    />
                    <CustomLineChart data={this.state.tournament_chart_data} tournNames={this.state.tournamentNamesToCompare} dataKey="round" />
                </div>
            )
        } else {
            return (
                <div className="PlayersDiv">
                    <ModeChange mode={this.state.mode} handleModeChange={this.handleModeChange} />
                    <DropdownGrid
                        key="1"
                        handleChange={this.handlePlayerDropDownChange}
                        players_list={this.state.players_list}
                        list_names={this.state.players_list_names}
                        handleNoToCompareChange={this.handleNoToCompareChange}
                        compareNo={this.state.noToCompare}
                        def_val="Select a Player"
                        mode="M"
                    />
                    <CustomLineChart data={this.state.player_chart_data} tournNames={this.state.playerNamesToCompare} dataKey="tournid" />
                </div>
            )
        }
    }
}

export default SnookerAST;