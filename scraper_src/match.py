import requests
from io import StringIO
from wst_urls import RESULT_URL
from logger import logLevel, log
from utils import isFloat

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
            with StringIO(r.text) as s:
                for line in s.readlines():
                    if "secs" in line:
                        p_idx = line.index("</p>")
                        val = line[p_idx-9:p_idx-5]
                        if not isFloat(val):
                            if val[0] == ">": # incase the shot time < 10.0
                                val = val[1:]
                            else:
                                log(logLevel.ERR, f"Tournament: {self.tournamentid} Match: {self.matchid} Failed to parse AST")
                                return -1, -1
                        rtn_arr.append(val)

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

        with StringIO(r.text) as s:
            for line in s.readlines():
                if "Final" in line:
                    if "Semi" in line:
                        return "semi-final"
                    elif "Quarter" in line:
                        return "quarter-final"
                    return "final"
                elif "<p>Round" in line:
                    return line.strip()[3:10]

        return "not found"

    @staticmethod
    def isMatchValid(matchid, tournamentid) -> bool:
        r = requests.get(RESULT_URL + tournamentid + "/" + matchid + "/", allow_redirects=False)
        if r.status_code != 200:
            return False
        return True
