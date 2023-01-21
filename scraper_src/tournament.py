import requests
from wst_urls import INDEX_URL, CAL_URL
from logger import log, logLevel
from datetime import date
from bs4 import BeautifulSoup
from urllib.parse import urlparse, parse_qs

class Tournament:
    def __init__(self, tournamentid):
        self.tournamentid = str(tournamentid)
        self.tournPageSoup = self.getPageSoup()
        self.tournamentname = self.getTournamentName()
        self.noofrounds = self.getNoOfRounds()
        self.matches = self.findValidMatches()


    def getPageSoup(self):
        r = requests.get(INDEX_URL + self.tournamentid, allow_redirects=False)
        if r.status_code != 200:
            return None

        return BeautifulSoup(r.text, 'html.parser')


    def findValidMatches(self):
        if self.tournPageSoup == None:
            return []

        rtn_arr = []

        matches = self.tournPageSoup.find_all("tr", {"data-href" : True})
        for m in matches:
            indx = m["data-href"].index(self.tournamentid)
            rtn_arr.append(m["data-href"][indx+6:indx+12])
        return rtn_arr


    def getTournamentName(self):
        if self.tournPageSoup == None:
            return "not found"

        name = self.tournPageSoup.find("div", {"id": "tournament-name"})
        return name.h1.text


    def getNoOfRounds(self):
        if self.tournPageSoup == None:
            return -1

        rounds = self.tournPageSoup.find_all('h3', class_ = 'matches-sub-title')
        return len(rounds)


    @staticmethod
    def isValidTourn(tourn_num):
        r = requests.get(INDEX_URL + str(tourn_num), allow_redirects=False)
        if r.status_code != 200:
            return False

        html_soup = BeautifulSoup(r.text, 'html.parser')
        name = html_soup.find("div", {"id": "tournament-name"}).h1.text
        if name is None or "championship league" in name.lower():
            return False
        return True


    @staticmethod
    def isFinished(tourn_num):
        # Construct an array of the possible month + year combinations
        month_arr = []
        currentMonth = date.today().month
        currentYear = date.today().year
        for i in range(1, 13):
            if currentMonth >= 6:
                yr = currentYear if i >= 6 else currentYear + 1
            else:
                yr = currentYear - 1 if i >= 6 else currentYear
            month_arr.append([i, yr])

        month_arr = month_arr[5:] + month_arr[:5] # wst year is July - May

        # Get all html of wst calendar pages for whole season
        wst_cal_html = ""
        for month in month_arr:
            r = requests.get(f"{CAL_URL}{month[1]}&month={month[0]}")
            if r.status_code == 200:
                wst_cal_html += f"{r.text.rstrip()}\nMonth={month[0]}\nYear={month[1]}\n"

        html_soup = BeautifulSoup(wst_cal_html, 'html.parser')
        trows = html_soup.find_all(['tr', 'li'])

        # iterate backwards to get last match
        found = False
        day, month, year = "", "", ""
        for h in reversed(trows):
            if found and h.name == "li" and h.has_attr('class') and h['class'][0] == 'active':
                monthAndYear = parse_qs(urlparse(h.a["href"]).query)
                month = monthAndYear["month"][0]
                year = monthAndYear["year"][0]
                break

            if not found:
                if len(h.select('td')) < 2:
                    continue
                if h.select('td')[1].a is None:
                    continue
                # Potential bug here - if more than one event is on a particular day 
                # then we wont be able to get the date this way, this though is rare
                if str(tourn_num) in h.select('td')[1].a['href'] and len(h.td.select('span')) > 1:
                    day = h.td.select('span')[1].text
                    found = True

        try:
            tourn_end_date = date(int(year), int(month), int(day))
        except ValueError:
            log(logLevel.ERR, f"Unable to parse end date for tournament {tourn_num}")
            return False

        if date.today() > tourn_end_date:
            return True # tournament finished
        else:
            return False # Will get here if tournament is in progress
