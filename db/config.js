const Sequelize = require('sequelize')

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

sequelize.authenticate()
    .then(() => {
        console.log('Mysql Connection has been successfully.');

    }).catch(err => {
        console.error('Unable to connect to the database:', err)
    })

module.exports = sequelize