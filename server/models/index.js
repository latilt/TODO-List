const fs = require('fs'),
    path = require('path'),
    Sequelize = require('sequelize'),
    config = require('../config/config'),
    db = {};
const sequelize = new Sequelize(config.db); // 시퀄라이즈에 DB 접속 정보 import (연결은 아님..)
fs.readdirSync(__dirname).filter((file) => {
  return (file.indexOf('.') !== 0) && (file !== 'index.js');
}).forEach((file) => {
  let model = sequelize['import'](path.join(__dirname, file));
  db[model.name] = model;
});
Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;


/*db.sequelize
.authenticate()
.then(() => {
    console.log('Connection has been established successfully.');
})
.catch(err => {
    console.error('Unable to connect to the database: ', err);
})*/
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'MyNewPass';