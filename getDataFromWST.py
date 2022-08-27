#!/usr/bin/python3

import math
from nis import match
from psutil import AccessDenied
from tournament import Tournament
from match import Match
from accessDB import accessSnookerDB

valid_tourns = ["14539", "14540", "14541", "14542", "14543", "14546", "14547", "14552", "14554"]

def findNewValidTournaments(startnum):
    endnum = startnum + 100
    return findValidTourns(startnum, endnum)

def findValidTourns(startnum, endnum):
    rtn_arr = []
    for i in range(startnum + 1, endnum): # Already checked up to 20000 on 14/08/22
        if Tournament.isValidTourn(i):
            rtn_arr.append(str(i))

    return rtn_arr

def main():
    dbcon = accessSnookerDB()
    current_largest_tourn = 14539#dbcon.getLargestTournamentID()
    new_tourn_ids = findNewValidTournaments(int(current_largest_tourn))
    new_tourns = []

    if new_tourn_ids:
        for tourn in new_tourn_ids:
            if Tournament.isFinished(tourn):
                print(f"{tourn} is finished")
                new_tourns.append(Tournament(tourn))
    else:
        print("No new tournaments found")

    for t in new_tourns:
        print(f"{t.tournamentid} being added to db")
        dbcon.addTournamentToDB(t)

    for t in new_tourns:
        for m_id in t.matches:
            m = Match(m_id, t.tournamentid)
            dbcon.addMatchToDB(m)

    print("finished w/o err")

if __name__ == "__main__":
    main()


# Theory of how a daily update script would run
# Checks for valid tournaments above our current largest
# If there is a valid tourn, check if it is finished
# If finished collect all matches to a list
# Save tournament to tournamentdb
# Save matches to matchdb