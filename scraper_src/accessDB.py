import psycopg2
import configparser
from logger import log, logLevel

class accessSnookerDB:
    def __init__(self) :
        creds = self.getCredentials()
        try:
            self.conn = psycopg2.connect(f"dbname={creds['dbname']} host={creds['host']} user={creds['user']} password={creds['password']}")
            self.cursor = self.conn.cursor()
        except psycopg2.DatabaseError as err:
            log(logLevel.ERR, err)
            return False


    def closedb(self):
        self.cursor.close()


    def getCredentials(self):
        config = configparser.ConfigParser()
        config.read("db_creds.ini")
        cred_dict = {
            "dbname" : config["pg_credentials"]["dbname"],
            "host" : config["pg_credentials"]["host"],
            "user" : config["pg_credentials"]["user"],
            "password" : config["pg_credentials"]["password"]
        }

        return cred_dict


    def addTournamentToDB(self, tournament):
        table = "tournaments"
        vals = [tournament.tournamentid, tournament.tournamentname]
        command = constructInsert(table, vals)

        try:
            self.cursor.execute(command)
            self.conn.commit()
        except psycopg2.errors.UniqueViolation as err:
            self.conn.rollback()
            log(logLevel.ERR ,"Error: This tournament already exists")


    def addMatchToDB(self, match):
        table = "matches"
        vals = [match.matchid, match.tournamentid, match.roundno,
                match.p1id, match.p1score, match.p1ast,
                match.p2id, match.p2score, match.p2ast]
        cols = ["matchid", "tournamentid", "roundno",
                "player1id", "player1score","player1ast",
                "player2id", "player2score", "player2ast"]
        command = constructInsert(table, vals, cols)

        try:
            self.cursor.execute(command)
            self.conn.commit()
            return True
        except psycopg2.errors.UniqueViolation as err:
            self.conn.rollback()
            log(logLevel.ERR ,"Error: This match already exists")
            return False


    def addPlayerToDB(self, player):
        table = "players"
        name = dealWithApostrophes(player.playerName)
        vals = [player.playerWstid, name]
        command = constructInsert(table, vals)

        try:
            self.cursor.execute(command)
            self.conn.commit()
            return True
        except psycopg2.errors.UniqueViolation as err:
            self.conn.rollback()
            log(logLevel.ERR ,"Error: This player already exists")
            return False


    def getLargestTournamentID(self) -> str:
        table = "tournaments"
        cols = ["max(tournamentid)"]
        command = constructSimpleSelect(table, cols)
        self.cursor.execute(command)
        row = self.cursor.fetchone()
        return row[0]


    def getAllTournaments(self):
        table = "tournaments"
        command = constructSimpleSelect(table)
        self.cursor.execute(command)
        rows = self.cursor.fetchall()
        return rows


    def getAllTournamentIDs(self):
        table = "tournaments"
        values = ["tournamentid"]
        command = constructSimpleSelect(table, values)
        self.cursor.execute(command)
        rows = self.cursor.fetchall()
        rtn = [str(r[0]) for r in rows] # handle strange output from pg
        return rtn


    def getPlayerByID(self, id):
        self.cursor.execute("SELECT * FROM players WHERE playerwstid=" + str(id) + ";")
        row = self.cursor.fetchone()
        return row


    def updateMatchesTournamentID(self, oldid, newid):
        command = f"UPDATE matches SET tournamentid={str(newid)} WHERE tournamentid={str(oldid)}"
        self.cursor.execute(command)
        self.conn.commit()


    def deleteTournamentByID(self, id):
        command = f"DELETE FROM tournaments WHERE tournamentid={str(id)}"
        self.cursor.execute(command)
        self.conn.commit()


# Create a DBUtils static class
def constructInsert(table, values, columns=None):
    rtn_cmd = f"INSERT INTO {table} "
    if columns:
        rtn_cmd += "("
        for i, col in enumerate(columns):
            rtn_cmd += f"{str(col)}, "
            if i == (len(columns) - 1):
                rtn_cmd = f"{rtn_cmd[:-2]}) "

    rtn_cmd += "VALUES ("
    for i, val in enumerate(values):
        if isinstance(val, str):
            rtn_cmd += f"'{str(val)}', "
        else:
            rtn_cmd += f"{str(val)}, "
        if i == (len(values) - 1):
            rtn_cmd = f"{rtn_cmd[:-2]});"

    return rtn_cmd

def constructSimpleSelect(table, vals=[]):
    rtn_cmd = f"SELECT "
    if vals:
        for val in vals:
            rtn_cmd += f"{val}, "
        rtn_cmd = f"{rtn_cmd[:-2]} "
    else:
        rtn_cmd += "* "
    rtn_cmd += f"FROM {table};"

    return rtn_cmd

def dealWithApostrophes(name):
    if "'" not in name:
        return name

    name_list = list(name)
    idx = name_list.index("'")
    name_list.insert(idx, "'")
    return ''.join(name_list)
