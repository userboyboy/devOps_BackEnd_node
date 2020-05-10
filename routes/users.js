var express = require('express');
var router = express.Router();

const JWT = require('jsonwebtoken');
const Sequelize = require('sequelize')
const Op = Sequelize.Op;

const User = require('../db/UserModel')
const { createToken, checkToken, SECRET } = require('../util/JWT')

/* GET users listing. */
router.get('/', function (req, res, next) {
  User.findAll().then(users => {
    let data = JSON.stringify(users, null, 4)
    res.send(data);
  });
});

// 登录页面
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
  const token = req.headers.authorization
  JWT.verify(token, SECRET, async (err, decoded) => {
    if (err) {
      //验证失败
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
      // console.log(req.body.params.query);
      // const test = await User.findAll({
      //   where: {
      //     [Op.like]: 'aaaa'
      //   }
      // }).then(res => {
      //   console.log(res, 'res');

      // })
      //   .catch(err => {
      //     console.log(err, 'err');
      //   })
      // console.log(test);


      const usersList = await User.findAndCountAll({
        limit: req.body.params.pagesize,
        offset: req.body.params.pagenum,
      }).catch(err => {
        console.log(err, 'err');
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

// 添加用户
router.post('/add', async (req, res) => {
  const token = req.headers.authorization
  const userDate = req.body
  console.log(userDate);
  JWT.verify(token, SECRET, async (err, decoded) => {
    if (err) {
      res.status(403).send({
        'meta': {
          'msg': '验证失败',
          'status': 403
        }
      })
    } else {
      await User.create(userDate).catch(err => {
        res.send({
          'meta': {
            'msg': '创建失败',
            'status': 400
          }
        })
      })
      res.send({
        'meta': {
          'msg': '创建成功',
          'status': 201
        }
      })
    }
  })
})


// 删除用户
router.delete('/delete/:id', async (req, res) => {
  const token = req.headers.authorization
  JWT.verify(token, SECRET, async (err, decoded) => {
    if (err) {
      res.status(403).send({
        'meta': {
          'msg': '验证失败',
          'status': 403
        }
      })
    } else {
      console.log(req.params.id);
      const usersInfo = await User.destroy({
        where: {
          id: req.params.id
        }
      })
      console.log(usersInfo, 'usersInfo');
      if (usersInfo == 0) {
        res.send({
          'meta': {
            'msg': '删除失败',
            'status': 400
          }
        })
      } else {
        res.send({
          'meta': {
            'msg': '删除成功',
            'status': 201
          }
        })
      }
    }
  })
})


// 获取个人详情
router.post('/profile', async (req, res) => {
  const token = req.headers.authorization
  const { id } = JWT.verify(token, SECRET)
  const usersInfo = await User.findByPk(id)
  res.send(usersInfo)
});

// 获取左侧菜单
router.get('/menus', function (req, res, next) {
  const token = req.headers.authorization
  JWT.verify(token, SECRET, async (err, decoded) => {
    if (err) {
      res.status(403).send({
        'meta': {
          'msg': '验证失败',
          'status': 403
        }
      })
    } else {
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
    }
  })

});

module.exports = router;

// router.post('/list', async (req, res) => {
//   const token = req.headers.authorization
//   JWT.verify(token, SECRET, async (err, decoded) => {
//     if (err) {
//       res.status(403).send({
//         'meta': {
//           'msg': '验证失败',
//           'status': 403
//         }
//       })
//     } else {
//       res.send({
//         'meta': {
//           'msg': 'ok',
//           'status': 200
//         }
//       })
//     }
//   })
// })
