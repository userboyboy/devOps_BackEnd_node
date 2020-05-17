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
      meta: {
        status: 401,
        msg: '账户密码错误',
      }
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
      let query = req.body.params.query
      const usersList = await User.findAndCountAll({
        where: {
          username: {
            [Op.like]: `%${query}%`
          }
        },
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
      const usersInfo = await User.destroy({
        where: {
          id: req.params.id
        }
      })
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


//修改用户
router.put('/edit/:id', async (req, res) => {
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
      const usersInfo = await User.update({
        email: req.body.email,
        password: req.body.password
      }, {
        where: {
          id: req.params.id
        }
      })
      if (usersInfo == 0) {
        res.send({
          'meta': {
            'msg': '修改失败',
            'status': 400
          }
        })
      } else {
        res.send({
          'meta': {
            'msg': '修改成功!',
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
            id: 1,
            path: 'users',
            children: [
              {
                authName: '用户列表',
                children: '',
                id: 1 - 1,
                path: 'users'
              }
            ]
          },
          {
            authName: '阿里云',
            id: 2,
            path: 'aliyun',
            children: [
              {
                authName: '域名',
                children: 'dns',
                id: 2 - 1,
                path: '/domain'
              },
              {
                authName: 'DNS解析',
                children: '',
                id: 2 - 2,
                path: '/dns'
              }
            ]
          },
          {
            authName: '权限管理',
            id: 3,
            path: 'rights',
            children: [{
              authName: '角色列表',
              children: '',
              id: 3 - 1,
              path: 'roles'
            }]
          },
          {
            authName: '测试页面',
            id: 4,
            path: 'test',
            children: [{
              authName: 'test',
              children: 'test',
              id: 4 - 1,
              path: 'test'
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
