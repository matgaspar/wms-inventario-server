const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  const ProdutosImagens = sequelize.define(
    'ProdutosImagens',
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        field: 'id',
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
      imagem: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'imagem',
      },
    }, {
      tableName: 'produtos_imagens',
    },
  );

  ProdutosImagens.associate = (models) => {
    ProdutosImagens.belongsTo(models.Produtos);
  };

  sequelizePaginate.paginate(ProdutosImagens);

  return ProdutosImagens;
};
