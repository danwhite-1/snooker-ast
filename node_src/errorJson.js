module.exports.createErrJson = (err_msg, err_code) => {
    return [{'error' : 'true',
             'e_msg' : err_msg,
             'e_code' : err_code}];
}
