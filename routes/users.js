var express = require('express');
var router = express.Router();

const JWT = require('jsonwebtoken');

const User = require('../db/UserModel')
const { createToken, checkToken, SECRET } = require('../util/JWT')

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

// 获取用户列表
router.post('/list', async (req, res, next) => {
  console.log(req.body.params.pagenum, 'body');

  const token = req.headers.authorization
  JWT.verify(token, SECRET, async (err, decoded) => {
    if (err) {
      //验证失败
      //console.log("令牌失效");
      res.status(403).send({
        'meta': {
          'msg': '登录失败',
          'status': 403
        }
      })
    } else {
      //验证成功
      //获取前端需要的相应数据
      //返回给前端相应的信息

      const usersList = await User.findAndCountAll({
        offset: req.body.params.pagesize,
        limit: req.body.params.pagenum,
      })

      res.send({
        'data': {
          'users': usersList
        },
        'meta': {
          'msg': '获取用户列表成功',
          'status': 200
        }
      })
    }
  })
})

router.post('/profile', async (req, res) => {
  const token = req.headers.authorization
  const { id } = JWT.verify(token, SECRET)
  const usersInfo = await User.findByPk(id)
  res.send(usersInfo)
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
        path: 'rights',
        children: [{
          authName: '角色列表',
          children: '',
          id: 111,
          path: 'roles'
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
