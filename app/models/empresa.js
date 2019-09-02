const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  const Empresa = sequelize.define(
    'Empresa',
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'id',
      },
      codigo: {
        type: DataTypes.INTEGER(4).UNSIGNED.ZEROFILL,
        allowNull: true,
        field: 'codigo',
      },
      nome: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'nome',
      },
      razaoSocial: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'razaoSocial',
      },
      fantasia: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'fantasia',
      },
      cnpj: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'cnpj',
      },
      ativo: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
        field: 'ativo',
      },
    }, {
      tableName: 'empresa',
    },
  );

  Empresa.associate = (models) => {
    Empresa.hasMany(models.Inventario);
    Empresa.belongsToMany(models.Usuario, { through: 'UsuarioEmpresa' });
  };

  sequelizePaginate.paginate(Empresa);

  return Empresa;
};
