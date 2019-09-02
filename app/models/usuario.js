/* eslint-disable func-names */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sequelizePaginate = require('sequelize-paginate');
const { TE, to } = require('../services/util.service');
const CONFIG = require('../config');

module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define(
    'Usuario',
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'id',
      },
      nome: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'nome',
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'email',
      },
      login: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'login',
      },
      senha: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'senha',
      },
      auditor: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
        field: 'auditor',
      },
      admin: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
        field: 'admin',
      },
      ativo: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
        field: 'ativo',
      },
    }, {
      tableName: 'usuario',
    },
  );

  Usuario.associate = (models) => {
    Usuario.belongsToMany(models.Empresa, { through: models.UsuarioEmpresa });
    Usuario.belongsToMany(models.Inventario, { through: models.ProdutosInventario });
    Usuario.belongsToMany(models.Contagem, { through: models.ProdutosInventario });
    Usuario.belongsToMany(models.Produtos, { through: models.ProdutosInventario });
  };


  Usuario.beforeSave(async (usuario) => {
    if (usuario.changed('senha')) {
      const [err, salt] = await to(bcrypt.genSalt(10));
      if (err) TE(err.message, true);

      const [error, hash] = await to(bcrypt.hash(usuario.senha, salt));
      if (error) TE(err.message, true);

      usuario.senha = hash;
    }
  });

  Usuario.prototype.comparePassword = async function (pw) {
    if (!this.senha) TE('senha not set');

    const [err, pass] = await to(bcrypt.compare(pw, this.senha));
    if (err) TE(err);

    if (!pass) TE('invalid senha');

    return this;
  };

  Usuario.prototype.getJWT = function (empresa) {
    const { secretOrKey, Options } = CONFIG.JWT;
    const payload = { id: this.id, empresa };
    return jwt.sign(payload, secretOrKey, Options);
  };

  sequelizePaginate.paginate(Usuario);

  return Usuario;
};
