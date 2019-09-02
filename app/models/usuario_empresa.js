const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  const UsuarioEmpresa = sequelize.define(
    'UsuarioEmpresa',
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'id',
      },
      UsuarioId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: 'usuario',
          key: 'id',
        },
        field: 'usuario',
      },
      EmpresaId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: 'empresa',
          key: 'id',
        },
        field: 'empresa',
      },
      ativo: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
        field: 'ativo',
      },
    }, {
      timestamps: false,
      tableName: 'usuario_empresa',
    },
  );

  UsuarioEmpresa.associate = (models) => {
    UsuarioEmpresa.belongsTo(models.Empresa);
    UsuarioEmpresa.belongsTo(models.Usuario);
  };

  sequelizePaginate.paginate(UsuarioEmpresa);

  return UsuarioEmpresa;
};
