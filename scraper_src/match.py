import requests
from io import StringIO
from wst_urls import RESULT_URL
from logger import logLevel, log
from utils import isFloat
from bs4 import BeautifulSoup

class Match:
    def __init__(self, matchid, tournamentid):
        self.matchid = str(matchid)
        self.tournamentid = str(tournamentid)
        self.p1ast, self.p2ast = self.getASTforMatch()
        self.roundno = self.getRoundNo()

    def getASTforMatch(self):
        rtn_arr = []
        r = requests.get(RESULT_URL + self.tournamentid + "/" + self.matchid + "/", allow_redirects=False)
        if r.status_code == 200:
            html_soup = BeautifulSoup(r.text, 'html.parser')
            asts = html_soup.find_all('p', class_ = 'score-ast')
            for val in asts:
                rtn_arr.append(val.text[:-5])

        if len(rtn_arr) == 2:
            return rtn_arr[0], rtn_arr[1]

        return -1, -1

    def getMatchInfo(self):
        ret_dict = {
            "matchid" : self.matchid,
            "tournamentid" : self.tournamentid,
            "p1ast" : self.p1ast,
            "p2ast" : self.p2ast
        }
        return ret_dict

    def getRoundNo(self) -> str: 
        r = requests.get(RESULT_URL + self.tournamentid + "/" + self.matchid + "/", allow_redirects=False)
        if r.status_code != 200:
            return "not found"

        html_soup = BeautifulSoup(r.text, 'html.parser')
        round = html_soup.find('div', class_ = 'component-title').p.text
        round_text_idx = round.find("Round")
        if(round_text_idx != -1):
            return round[:round_text_idx+7]

        if "Final" in round:
            if "Semi" in round:
                return "semi-final"
            elif "Quarter" in round:
                return "quarter-final"
            return "final"

        return "not found"

    @staticmethod
    def isMatchValid(matchid, tournamentid) -> bool:
        r = requests.get(RESULT_URL + tournamentid + "/" + matchid + "/", allow_redirects=False)
        if r.status_code != 200:
            return False
        return True
