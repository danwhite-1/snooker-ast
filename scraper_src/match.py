import requests
from wst_urls import RESULT_URL
from bs4 import BeautifulSoup
from accessDB import accessSnookerDB
from player import Player

class Match:
    def __init__(self, matchid, tournamentid):
        self.matchid = str(matchid)
        self.tournamentid = str(tournamentid)
        self.matchPageSoup = self.getPageSoup()
        self.p1ast, self.p2ast = self.getASTforMatch()
        self.p1id, self.p2id = self.getPlayers()
        self.p1score, self.p2score = self.getScores()
        self.roundno = self.getRoundNo()


    def getPageSoup(self):
        r = requests.get(RESULT_URL + self.tournamentid + "/" + self.matchid + "/", allow_redirects=False)
        if r.status_code != 200:
            return None

        return BeautifulSoup(r.text, 'html.parser')


    def getASTforMatch(self):
        if self.matchPageSoup== None:
            return -1, -1

        rtn_arr = []
        asts = self.matchPageSoup.find_all('p', class_ = 'score-ast')

        # Some match pages do not have ast data, in this case we return '-2' to indicate this
        if not asts:
            return -2, -2

        for val in asts:
            rtn_arr.append(val.text[:-5])

        if len(rtn_arr) == 2:
            return rtn_arr[0], rtn_arr[1]

        return -1, -1


    def getRoundNo(self) -> str: 
        if self.matchPageSoup == None:
            return "not found"

        round = self.matchPageSoup.find('div', class_ = 'component-title').p.text
        round_text_idx = round.find("Round")
        if(round_text_idx != -1):
            return round[:round_text_idx+7]

        # This coveres 2022 CoC, will need to update
        if self.tournamentid == "14586":
            return self.handleCoC(round)

        if "Final" in round:
            if "Semi" in round:
                return "semi-final"
            elif "Quarter" in round:
                return "quarter-final"
            return "final"

        return "not found"


    # CoC uses a normal format, but with strange round naming
    # This function corrects it to be more normal
    def handleCoC(self, round):
        if "Group Semi-Finals" in round:
            return "Round 1"
        elif "Group Final" in round:
            return "quarter-final"
        elif "Semi-Final" in round:
            return "semi-final"
        else:
            return "final"


    def getPlayers(self):
        if self.matchPageSoup == None:
            return -1, -1

        rtn_arr = []
        p1 = self.matchPageSoup.find('p', class_ = 'name text-right')

        p1_id = p1.a["href"].split("/")[4]
        rtn_arr.append(p1_id)

        p2 = self.matchPageSoup.find_all('p', class_ = 'name')[1]
        p2_id = p2.a["href"].split("/")[4]
        rtn_arr.append(p2_id)

        # check if players are in db, if not then create
        dbcon = accessSnookerDB()
        p1inDB = dbcon.getPlayerByID(p1_id)
        if p1inDB is None:
            p1_name = p1.a.text
            dbcon.addPlayerToDB(Player(p1_id, p1_name))
        p2inDB = dbcon.getPlayerByID(p2_id)
        if p2inDB is None:
            p2_name = p2.a.text
            dbcon.addPlayerToDB(Player(p2_id, p2_name))

        return rtn_arr


    def getScores(self):
        if self.matchPageSoup == None:
            return -1, -1

        rtn_arr = []
        p1_score = self.matchPageSoup.find('p', class_ = 'score score-player1 text-right')
        if p1_score is None:
            return -1, -1
        rtn_arr.append(p1_score.text)

        p2_score = self.matchPageSoup.find('p', class_ = 'score score-player2')
        if p2_score is None:
            return -1, -1
        rtn_arr.append(p2_score.text)

        return rtn_arr


    @staticmethod
    def isMatchValid(matchid, tournamentid) -> bool:
        r = requests.get(RESULT_URL + tournamentid + "/" + matchid + "/", allow_redirects=False)
        if r.status_code != 200:
            return False
        return True
