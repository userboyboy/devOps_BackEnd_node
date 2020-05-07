var express = require('express');
var router = express.Router();

const jwt = require("jsonwebtoken");

const User = require('../db/UserModel')
const { createToken, checkToken, SECRET } = require('../util/jwt')

/* GET users listing. */
router.get('/', function (req, res, next) {
  User.findAll().then(users => {
    let data = JSON.stringify(users, null, 4)
    res.send(data);
  });
});

router.post('/login', async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.body.username,
      password: req.body.password
    }
  })

  if (!user) {
    res.send({
      msg: '账户密码错误'
    })
  }
  res.send({
    data: {
      token: createToken(user.id)
    },
    meta: {
      status: 200,
      msg: '登录成功',
    }
  })
})

router.post('/profile', async (req, res) => {
  const raw = req.headers.authorization
  const { id } = jwt.verify(raw, SECRET)
  const users = await User.findByPk(id)
  res.send(users)
});


router.get('/menus', function (req, res, next) {
  res.send({
    data: [
      {
        authName: '用户管理',
        id: 125,
        path: 'users',
        children: [
          {
            authName: '用户列表',
            children: '',
            id: 110,
            path: 'users'
          }
        ]
      },
      {
        authName: '权限管理',
        id: 103,
        path: '"rights',
        children: [{
          authName: '角色列表',
          children: '',
          id: 111,
          path: '"roles"'
        }]
      }
    ],
    meta: {
      msg: '获取菜单列表成功',
      status: 200
    }
  })
});

module.exports = router;
