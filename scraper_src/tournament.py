import requests
from io import StringIO
from wst_urls import INDEX_URL, CAL_URL
from datetime import date

class Tournament:
    def __init__(self, tournamentid):
        self.tournamentid = str(tournamentid)
        self.tournamentname = self.getTournamentName()
        self.noofrounds = self.getNoOfRounds()
        self.matches = self.findValidMatches()

    def findValidMatches(self):
        rtn_arr = []
        r = requests.get(INDEX_URL + self.tournamentid, allow_redirects=False)
        if r.status_code == 200:
            with StringIO(r.text) as s:
                for line in s.readlines():
                    if "data-href" in line:
                        idx = line.index(self.tournamentid)
                        rtn_arr.append(line[idx+6:idx+12])
            return rtn_arr
        else:
            return False

    def getTournamentName(self):
        r = requests.get(INDEX_URL + self.tournamentid, allow_redirects=False)
        if r.status_code == 200:
            with StringIO(r.text) as s:
                found = False
                for line in s.readlines():
                    if found:
                        return line.strip()[4:-5]
                    if "tournament-name" in line:
                        found = True
        
        return "not found"

    def getNoOfRounds(self):
        r = requests.get(INDEX_URL + self.tournamentid, allow_redirects=False)
        if r.status_code == 200:
            with StringIO(r.text) as s:
                counter = 0
                for line in s.readlines():
                    if "matches-sub-title" in line:
                        counter += 1
                return counter

        return -1

    @staticmethod
    def isValidTourn(tourn_num):
        valid = False
        isChampLeague = False
        r = requests.get(INDEX_URL + str(tourn_num), allow_redirects=False)
        if r.status_code == 200:
            with StringIO(r.text) as s:
                for line in s.readlines():
                    if valid:
                        if "championship league" in line.lower():
                            isChampLeague = True
                        break
                    if "tournament-name" in line:
                        valid = True

        return valid and not isChampLeague

    @staticmethod # This is a bit messy, could do with a refactor or whole rethink
    def isFinished(tourn_num):
        month = date.today().month
        year1 = date.today().year if month>=6 else date.today().year - 1
        year2 = year1 + 1

        month_arr = [[6, year1], 
                     [7, year1], 
                     [8, year1], 
                     [9, year1], 
                     [10, year1], 
                     [11, year1], 
                     [12, year1], 
                     [1, year2], 
                     [2, year2], 
                     [3, year2], 
                     [4, year2], 
                     [5, year2]]

        # get all html of wst calendar pages for whole season
        wst_cal_html = ""
        for month in month_arr:
            r = requests.get(f"{CAL_URL}{month[1]}&month={month[0]}")
            if r.status_code == 200:
                wst_cal_html += f"{r.text.rstrip()}\nMonth={month[0]}\nYear={month[1]}\n"

        # search through html backwards to find last mention of tournament
        with StringIO(wst_cal_html) as s:
            find_arr = {"found" : False, "count" : 0 }
            current_month = ""
            for idx, line in enumerate(reversed(s.readlines())):
                if "Month=" in line:
                    current_month = line.rstrip()[6:]
                if "Year=" in line:
                    current_year = line.rstrip()[5:]

                if find_arr["found"]:
                    if find_arr["count"] >= 1:
                        span_idx = line.rstrip().find("</span></td>")
                        day = line.rstrip()[span_idx-2:span_idx]
                        try:
                            tourn_end_date = date(int(current_year), int(current_month), int(day))
                        except ValueError:
                            return False # Will get here if tournament is in progress
                        if date.today() > tourn_end_date:
                            return True # tournament finished
                        else:
                            return False
                    else:
                        find_arr["count"] += 1
                
                elif str(tourn_num) in line:
                    find_arr["found"] = True

        return False # Shouldn't get here