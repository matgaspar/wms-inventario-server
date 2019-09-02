const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const ConfigDB = require('../config/database');

const db = {};
const sequelize = new Sequelize(ConfigDB);

fs.readdirSync(__dirname)
  .filter(
    file => file.indexOf('.') !== 0 && file !== path.basename(__filename) && file.slice(-3) === '.js',
  )
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    // console.log('Model associado: ', modelName);
    db[modelName].associate(db);
  }
});

/* db.Usuario.belongsTo(db.Empresa, {
  foreignKey: 'empresa',
  constraints: false,
}); */

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
