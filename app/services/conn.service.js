const Sequelize = require('sequelize');

const sequelize = new Sequelize('mariadb://web7s526:gaspar15@web7sistemas.com:3306/web7s526_api');

sequelize
  .authenticate()
  .then(() => {
    console.log('A conexão foi estabelecida com sucesso.');
  })
  .catch((err) => {
    console.error('Não é possível conectar-se ao banco de dados:', err);
  });

module.exports = { Sequelize, sequelize };
