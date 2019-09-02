const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  const ProdutosInventario = sequelize.define(
    'ProdutosInventario',
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
      ProdutoId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: 'produtos',
          key: 'id',
        },
        field: 'produtos',
      },
      ContagemId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        references: {
          model: 'contagem',
          key: 'id',
        },
        field: 'contagem',
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
      quantidade: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        field: 'quantidade',
      },
    }, {
      tableName: 'produtos_inventario',
    },
  );

  ProdutosInventario.associate = (models) => {
    ProdutosInventario.belongsTo(models.Inventario);
    ProdutosInventario.belongsTo(models.Produtos);
    ProdutosInventario.belongsTo(models.Contagem);
    ProdutosInventario.belongsTo(models.Usuario);
  };

  sequelizePaginate.paginate(ProdutosInventario);

  return ProdutosInventario;
};
