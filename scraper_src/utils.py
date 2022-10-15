def isFloat(var):
    try:
        float(var)
        return True
    except ValueError:
        return False

def isInt(var):
    try:
        int(var)
        return True
    except ValueError:
        return False