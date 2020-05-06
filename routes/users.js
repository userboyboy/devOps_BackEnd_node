var express = require('express');
var router = express.Router();
const User = require('../db/UserModel')

/* GET users listing. */
router.get('/', function (req, res, next) {
  User.findAll().then(users => {
    let data = JSON.stringify(users, null, 4)
    console.log(data);
    res.send(data);

  });
});


router.post('/register', function (req, res, next) {
  var data = {
    username: req.body.username,
    password: req.body.password
  }
  User.create({ username: data.username, password: data.password }).then(res => {
    console.log("res ID:", res.id);
  });

});



module.exports = router;
