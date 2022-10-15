#!/usr/bin/python3

from tournament import Tournament
from match import Match
from accessDB import accessSnookerDB
from logger import logLevel, log, initLogs, logOutput
from argparse import ArgumentParser
from typing import List
from utils import isInt

valid_tourns = ["14539", "14540", "14541", "14542", "14543", "14546", "14547", "14552", "14554"]

def findNewValidTournaments(startnum) -> List[int]:
    endnum = startnum + 100
    return findValidTourns(startnum, endnum)

def findValidTourns(startnum, endnum) -> List[int]:
    rtn_arr = []
    for i in range(startnum + 1, endnum): # Already checked up to 20000 on 14/08/22
        if Tournament.isValidTourn(i):
            rtn_arr.append(str(i))

    return rtn_arr

def checkNewTourns(newTournIds) -> List[Tournament]:
    rtn_arr = []
    if not newTournIds:
        log(logLevel.INFO, "No new tournaments found")
        return rtn_arr

    for tourn in newTournIds:
        if Tournament.isFinished(tourn):
            log(logLevel.INFO ,f"Tournament {tourn} is finished")
            rtn_arr.append(Tournament(tourn))
        else:
            log(logLevel.INFO, f"Tournament {tourn} is not finished")

    return rtn_arr

def addNewTournsToDb(dbcon, newTourns) -> None:
    if newTourns:
        for t in newTourns:
            log(logLevel.INFO ,f"{t.tournamentid} being added to DB")
            dbcon.addTournamentToDB(t)
    else:
        log(logLevel.INFO, "No tournaments to be added to DB")

def addTournMatchesToDB(dbcon, newTourns) -> None:
    for t in newTourns:
        for m_id in t.matches:
            if Match.isMatchValid(m_id, t.tournamentid):
                m = Match(m_id, t.tournamentid)
                dbcon.addMatchToDB(m)

def addTournMatchToDB(dbcon, tournamentid, matchid) -> None:
    # TODO Check if tournament is already in DB
    if Match.isMatchValid(matchid, tournamentid):
        m = Match(matchid, tournamentid)
        dbcon.addMatchToDB(m)

def parseArgs():
    parser = ArgumentParser()
    parser.add_argument("-o", "--output", help="Send output to logfile or stdout. Default value: 'logfile' Option value: 'stdout'")
    parser.add_argument("-FAT", "--forceaddtourn", help="Force adding or re-adding of a specified tournament.")
    parser.add_argument("-FAM", "--forceaddmatch", help="Force adding or re-adding of a specified match. Must be used with -FAT.")
    args = parser.parse_args()

    if args.output == "stdout":
        logOutput[0] = "stdout"
        log(logLevel.INFO, "Setting log output to stdout")
    else:
        initLogs()

    return args

# TODO Tidyup logic + refactor
def main():
    args = parseArgs()

    dbcon = accessSnookerDB()

    if args.forceaddtourn:
        if args.forceaddmatch:
            if not isInt(args.forceaddmatch) or not Match.isMatchValid(args.forceaddmatch, args.forceaddtourn):
                log(logLevel.WARN, f"Invalid match and/or tournament ID")
                return
            addTournMatchToDB(dbcon, args.forceaddtourn, args.forceaddmatch)
            dbcon.closedb()
            log(logLevel.INFO, "Finished without Error")
            return

        if not isInt(args.forceaddtourn) or not Tournament.isValidTourn(args.forceaddtourn):
            log(logLevel.WARN, f"Invalid tournament ID")
            return

        new_tourn_ids = [args.forceaddtourn]
    else:
        current_largest_tourn = dbcon.getLargestTournamentID()
        new_tourn_ids = findNewValidTournaments(int(current_largest_tourn))

    new_tourns = checkNewTourns(new_tourn_ids)
    addNewTournsToDb(dbcon, new_tourns)
    addTournMatchesToDB(dbcon, new_tourns)

    dbcon.closedb()

    log(logLevel.INFO, "Finished without Error")

if __name__ == "__main__":
    main()

# Theory of how a daily update script would run
# Checks for valid tournaments above our current largest
# If there is a valid tourn, check if it is finished
# If finished collect all matches to a list
# Save tournament to tournamentdb
# Save matches to matchdb