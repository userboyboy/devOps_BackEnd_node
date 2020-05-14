const Sequelize = require('sequelize')
const Core = require('@alicloud/pop-core');

const sequelize = new Sequelize('testtest', 'testtest', 'testtest', {
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    host: '118.25.21.78',
    dialect: 'mysql',
});



module.exports = sequelize