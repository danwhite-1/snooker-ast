#!/usr/bin/python3

from tournament import Tournament
from match import Match
from accessDB import accessSnookerDB
from logger import logLevel, log, initLogs, logOutput
from argparse import ArgumentParser

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

def parseArgs():
    parser = ArgumentParser()
    parser.add_argument("-o", "--output", help="Send output to logfile or stdout. Default value: 'logfile' Option value: 'stdout'")
    args = parser.parse_args()

    if args.output == "stdout":
        logOutput[0] = "stdout"
        log(logLevel.INFO, "Setting log output to stdout")
    else:
        initLogs()

def main():
    dbcon = accessSnookerDB()
    current_largest_tourn = dbcon.getLargestTournamentID()
    new_tourn_ids = findNewValidTournaments(int(current_largest_tourn))
    new_tourns = []

    if new_tourn_ids:
        for tourn in new_tourn_ids:
            if Tournament.isFinished(tourn):
                log(logLevel.INFO ,f"{tourn} is finished")
                new_tourns.append(Tournament(tourn))
            else:
                log(logLevel.INFO, f"{tourn} is not finished")
    else:
        log(logLevel.INFO, "No new tournaments found")

    if new_tourns:
        for t in new_tourns:
            log(logLevel.INFO ,f"{t.tournamentid} being added to DB")
            dbcon.addTournamentToDB(t)
    else:
        log(logLevel.INFO, "No tournaments to be added to DB")

    for t in new_tourns:
        for m_id in t.matches:
            if Match.isMatchValid(m_id, t.tournamentid):
                m = Match(m_id, t.tournamentid)
                dbcon.addMatchToDB(m)

    dbcon.closedb()

    log(logLevel.INFO, "Finished without Error")

if __name__ == "__main__":
    parseArgs()
    main()

# Theory of how a daily update script would run
# Checks for valid tournaments above our current largest
# If there is a valid tourn, check if it is finished
# If finished collect all matches to a list
# Save tournament to tournamentdb
# Save matches to matchdb