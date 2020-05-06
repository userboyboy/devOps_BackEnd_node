const sequelize = require('./config');
const Sequelize = require('sequelize')

const Model = Sequelize.Model;


const User = sequelize.define('user', {
    // attributes
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    // options
});

// sequelize.sync().then(function () {
//     return User.create({
//         username: 'wang',
//         password: '123'
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