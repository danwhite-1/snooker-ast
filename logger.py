from enum import Enum
from datetime import datetime

logOutput = "logfile"

class logLevel(str, Enum):
    INFO = "INFO"
    WARN = "WARN"
    ERR = "ERROR"
    DEBUG = "DEBUG"

def initLogs():
    logfile = open("snookerast_logs.txt", "a")
    logfile.write(f"\n{'-' * 60}\n")
    logfile.close()

def log(level, message):
    if logOutput == "logfile":
        logfile = open("snookerast_logs.txt", "a")
        logfile.write(createLogMessage(level, message))
        logfile.close()
    else:
        print(createLogMessage(level, message))

def createLogMessage(level, message):
    return f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}][{level}] {message}\n"
