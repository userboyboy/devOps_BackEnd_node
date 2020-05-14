const jwt = require("jsonwebtoken");

const SECRET = "ZyHN09ngd2OoFULf"

let createToken = (id, expires = '1h') => {
    const token = jwt.sign({
        id: id
    }, SECRET, {
        expiresIn: '1h'
    });
    console.log(token);
    return token
}

let checkToken = (token) => {
    const { id } = jwt.verify(token, SECRET)
    return id
}


module.exports = {
    createToken, checkToken, SECRET
}