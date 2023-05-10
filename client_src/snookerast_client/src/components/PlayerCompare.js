import { Component } from "react";
import CustomLineChart from "./CustomLineChart";
import DropdownGrid from "./DropdownGrid";

class PlayerCompare extends Component {
    constructor(props) {
        super(props)
        this.state = {
            players_list : [],
            players_list_names : [],
            player_chart_data : [],
            playerNamesToCompare : [],
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
        const search_url = "/api/players";
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
                        if (Object.keys(arrayItem).length !== 1) {
                            rtnData.push(arrayItem);
                        }
                    });

                    const newData = playerData[0];
                    for (let t in newData) {
                        console.log(newData[t])
                        if (rtnData.find(tourn => tourn.tournname === newData[t]["tournamentname"])) {
                            rtnData.find(tourn => tourn.tournname === newData[t]["tournamentname"])[selection.playername] = newData[t]["ast"]
                        } else {
                            let obj = {
                                tournname : newData[t]["tournamentname"],
                                [selection.playername] : newData[t]["ast"],
                            };
                            rtnData.push(obj);
                        }
                    }

                    let pNames = this.state.playerNamesToCompare;
                    if (pNames[DDkey] !== "undefined") {
                        pNames[DDkey] = selection.playername;
                    }

                    let s_m = pNames.length ? true : false;

                    this.setState({
                        player_chart_data : rtnData,
                        playerNamesToCompare : pNames,
                        selection_made : s_m
                    });
                } else {
                    alert("Tournament " + selection.tournamentid + " doesn't exist. Error: " + playerData[0].e_msg);
                }
            })
            .catch(error => alert("An error occured: " + error.message));
    }

    handleNoToCompareChange = (newVal) => {
        if (newVal > this.state.noToCompare) {
            this.setState({ noToCompare : newVal});
            return;
        }

        let pNames = this.state.playerNamesToCompare;
        pNames.pop();
        this.setState({
            noToCompare : newVal,
            playerNamesToCompare : pNames
        })
    }

    render() {
        if (!this.state.we_have_data) {
            return <div />
        }

        return (
            <div className="PlayersDiv">
                <DropdownGrid
                    key="1"
                    handleChange={this.handlePlayerDropDownChange}
                    players_list={this.state.players_list}
                    list_names={this.state.players_list_names}
                    handleNoToCompareChange={this.handleNoToCompareChange}
                    compareNo={this.state.noToCompare}
                    def_val="Select a Player"
                    selection_made={this.state.selection_made}
                    mode="M"
                />
                <CustomLineChart data={this.state.player_chart_data} tournNames={this.state.playerNamesToCompare} dataKey="tournname" />
            </div>
        )
    }
}

export default PlayerCompare
