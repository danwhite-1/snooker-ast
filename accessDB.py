import psycopg2

class accessSnookerDB:
    def __init__(self) :
        try:
            self.conn = psycopg2.connect("dbname='snookertest' host='/tmp/' user='postgres' password='myPassword'")
            self.cursor = self.conn.cursor()
        except psycopg2.DatabaseError as err:
            print(err)
            return False

    def closedb(self):
        self.cursor.close()

    def addTournamentToDB(self, tournament):
        table = "tournaments" # needs to be an enum
        vals = [tournament.tournamentid, tournament.tournamentname]
        command = constructInsert(table, vals)

        try:
            self.cursor.execute(command)
            self.conn.commit()
        except psycopg2.errors.UniqueViolation as err:
            self.conn.rollback()
            print("Error: This tournament already exists")

    def addMatchToDB(self, match):
        tab = "matches"
        vals = [match.matchid, match.tournamentid, match.roundno, match.p1ast, match.p2ast]
        command = constructInsert(tab, vals)
        self.cursor.execute(command)
        self.conn.commit()
        if self.cursor.rowcount == 1:
            return True
        else:
            return False

    def getLargestTournamentID(self) -> str:
        table = "tournaments"
        cols = ["max(tournamentid)"]
        command = constructSimpleSelect(table, cols)
        self.cursor.execute(command)
        row = self.cursor.fetchone()
        return row[0]

    def getAllTournamants(self):
        table = "tournaments"
        command = constructSimpleSelect(table)
        self.cursor.execute(command)
        rows = self.cursor.fetchall()
        return rows

    def getTournamentFromDB(self, id):
        self.cursor.execute("SELECT * FROM tournaments WHERE tournamentid=" + str(id) + ";")
        row = self.cursor.fetchone()
        return row

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

def constructSimpleSelect(table, vals=None):
    rtn_cmd = f"SELECT "
    if vals:
        for val in vals:
            rtn_cmd += f"{val}, "
        rtn_cmd = f"{rtn_cmd[:-2]} "
    else:
        rtn_cmd += "* "
    rtn_cmd += f"FROM {table};"

    return rtn_cmd
