from enum import Enum
from datetime import datetime

class logLevel(str, Enum):
    INFO = "INFO"
    WARN = "WARN"
    ERR = "ERROR"
    DEBUG = "DEBUG"

def initLogs():
    logfile = open("snookerast_logs.txt", "a")
    logfile.write(f"{'-' * 60}")
    logfile.close()

def log(level, message):
    logfile = open("snookerast_logs.txt", "a")
    logfile.write(createLogMessage(level, message))
    logfile.close()

def createLogMessage(level, message):
    return f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}][{level}] {message}\n"
