const sequelize = require('../dbconfig');
const Sequelize = require('sequelize')

const Model = Sequelize.Model;


class User extends Model { }
User.init({
    // attributes
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    user_type: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 0
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'user'
    // options
});

// User.sync({ force: true }).then(() => {
//     // 现在 `users` 表会与模型定义一致
//     return User.create({
//         username: 'admin',
//         password: '123456',
//         user_type: 0,
//         email: '375770336@qq.com'
//     });
// });

// for (let index = 0; index < 50; index++) {
//     User.sync({ force: true }).then(() => {
//     // 现在 `users` 表会与模型定义一致
//     return User.create({
//         username: `admin${index}`,
//         password: `123456${index}`,
//         user_type: 0,
//         email: `375770336${index}@qq.com`
//     });
// });
// }



// sequelize.sync().then(function () {
//     return User.create({
//         username: 'wang',
//         password: '123',
//         user_type: 0
//     });
// }).then(function (data) {
//     //获取数据
//     console.log(data.get({
//         plain: true
//     }));
// }).catch(function (err) {
//     //异常捕获
//     console.log('Unable to connect to the database:', err);
// });

module.exports = User