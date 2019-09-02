const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  const Produtos = sequelize.define(
    'Produtos',
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        field: 'id',
      },
      descricao: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'descricao',
      },
      marca: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'marca',
      },
      status: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
        field: 'status',
      },
      embalagem: {
        type: DataTypes.INTEGER(100),
        allowNull: false,
        field: 'embalagem',
      },
      estoque: {
        type: DataTypes.INTEGER(100),
        allowNull: false,
        field: 'estoque',
      },
      local: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'local',
      },
    }, {
      tableName: 'produtos',
    },
  );

  Produtos.associate = (models) => {
    Produtos.hasMany(models.ProdutosCodbarras);
    Produtos.hasMany(models.ProdutosImagens);
    Produtos.belongsToMany(models.Inventario, { through: models.ProdutosInventario });
    Produtos.belongsToMany(models.Contagem, { through: models.ProdutosInventario });
    Produtos.belongsToMany(models.Usuario, { through: models.ProdutosInventario });
  };

  sequelizePaginate.paginate(Produtos);

  return Produtos;
};
