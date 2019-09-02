const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  const Contagem = sequelize.define(
    'Contagem',
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'id',
      },
      InventarioId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: 'inventario',
          key: 'id',
        },
        field: 'inventario',
      },
      descricao: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'descricao',
      },
      obs: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'obs',
      },
      ativo: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
        field: 'ativo',
      },
      finalizado: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
        field: 'finalizado',
      },
    }, {
      timestamps: false,
      tableName: 'contagem',
    },
  );

  Contagem.associate = (models) => {
    Contagem.belongsTo(models.Inventario);
    Contagem.belongsToMany(models.Produtos, { through: 'ProdutosInventario' });
  };

  sequelizePaginate.paginate(Contagem);

  return Contagem;
};
