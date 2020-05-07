const jwt = require("jsonwebtoken");

const SECRET = "ZyHN09ngd2OoFULf"

let createToken = (id, expires = 1, strTimer = 'hours') => {
    const token = jwt.sign({
        id,
        expires: expires,
        strTimer: strTimer
    }, SECRET, {
        expiresIn: expires + " " + strTimer
    });
    return token
}

let checkToken = (token) => {
    const { id } = jwt.verify(token, SECRET)
    return id
}


module.exports = {
    createToken, checkToken, SECRET

}