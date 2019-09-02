const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  const Inventario = sequelize.define(
    'Inventario',
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'id',
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
      nome: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'nome',
      },
      descricao: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'descricao',
      },
      obs: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'obs',
      },
      finalizado: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
        field: 'finalizado',
      },
    }, {
      tableName: 'inventario',
    },
  );

  Inventario.associate = (models) => {
    Inventario.belongsTo(models.Empresa);
    Inventario.hasMany(models.Contagem);
    Inventario.belongsToMany(models.Produtos, { through: models.ProdutosInventario });
    Inventario.belongsToMany(models.Usuario, { through: models.ProdutosInventario });
  };

  sequelizePaginate.paginate(Inventario);

  return Inventario;
};
