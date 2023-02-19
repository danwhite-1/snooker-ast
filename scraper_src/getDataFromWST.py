#!/usr/bin/python3

from tournament import Tournament
from match import Match
from accessDB import accessSnookerDB
from logger import logLevel, log, initLogs, logOutput
from argparse import ArgumentParser
from typing import List


def findNewValidTournaments(startnum) -> List[int]:
    endnum = startnum + 250
    return findValidTourns(startnum, endnum)


def findValidTourns(startnum, endnum) -> List[int]:
    rtn_arr = []
    last_valid_tourn = startnum
    for i in range(startnum + 1, endnum): # Already checked up to 20000 on 14/08/22
        if Tournament.isValidTourn(i):
            rtn_arr.append(str(i))
            last_valid_tourn = i
        if i - last_valid_tourn > 50:
            log(logLevel.INFO, "No valid tournaments found in the last 50. Seach complete")
            break

    return rtn_arr


def checkNewTourns(dbcon, newTournIds) -> List[Tournament]:
    rtn_arr = []
    if not newTournIds:
        log(logLevel.INFO, "No new tournaments found")
        return rtn_arr

    existingTourns = dbcon.getAllTournamentIDs()

    # Don't check tourns we already have
    for et in existingTourns:
        if et in newTournIds:
            newTournIds.remove(et)

    for tourn in newTournIds:
        if Tournament.isFinished(tourn) and tourn not in existingTourns:
            log(logLevel.INFO ,f"Tournament {tourn} is finished")
            rtn_arr.append(Tournament(tourn))
        else:
            log(logLevel.INFO, f"Tournament {tourn} is not finished")

    return rtn_arr


def addNewTournsToDb(dbcon, newTourns) -> None:
    if newTourns:
        for t in newTourns:
            log(logLevel.INFO ,f"{t.tournamentid}:{t.tournamentname} being added to DB")
            dbcon.addTournamentToDB(t)
    else:
        log(logLevel.INFO, "No tournaments to be added to DB")


def addTournMatchesToDB(dbcon, newTourns) -> None:
    for t in newTourns:
        log(logLevel.INFO ,f"Matches for {t.tournamentid} being added to DB")
        for m_id in t.matches:
            if Match.isMatchValid(m_id, t.tournamentid):
                m = Match(m_id, t.tournamentid)
                dbcon.addMatchToDB(m)


def cleanupQualifierTournaments(dbcon) -> None:
    currentTourns = dbcon.getAllTournaments()
    for t1 in currentTourns:
        for t2 in currentTourns:
            if t1[1] in t2[1] and t1[1] != t2[1]:
                if "world championship" in t1[1].lower():
                    continue
                log(logLevel.INFO ,f"{t2[0]}:{t2[1]} being removed from DB")
                dbcon.updateMatchesTournamentID(t2[0], t1[0])
                dbcon.setTournamentAsQualifier(t2[0])


def addTournMatchToDB(dbcon, tournamentid, matchid) -> None:
    # TODO Check if tournament is already in DB
    if Match.isMatchValid(matchid, tournamentid):
        m = Match(matchid, tournamentid)
        dbcon.addMatchToDB(m)


def parseArgs() -> None:
    parser = ArgumentParser()
    parser.add_argument("-o", "--output", help="Send output to logfile or stdout. Default value: 'logfile' Option value: 'stdout'")
    args = parser.parse_args()

    if args.output == "stdout":
        logOutput[0] = "stdout"
        log(logLevel.INFO, "Setting log output to stdout")
    else:
        initLogs()


def main():
    parseArgs()

    dbcon = accessSnookerDB()

    tournid_search_start = 14500 # good place to start searching for 2022/23 tournaments
    new_tourn_ids = findNewValidTournaments(int(tournid_search_start))

    new_tourns = checkNewTourns(dbcon, new_tourn_ids)
    addNewTournsToDb(dbcon, new_tourns)
    addTournMatchesToDB(dbcon, new_tourns)
    cleanupQualifierTournaments(dbcon)

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