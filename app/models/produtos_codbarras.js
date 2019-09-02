const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  const ProdutosCodbarras = sequelize.define(
    'ProdutosCodbarras',
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
      codBarra: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'cod_barra',
      },
    }, {
      timestamps: false,
      tableName: 'produtos_codbarras',
    },
  );

  ProdutosCodbarras.associate = (models) => {
    ProdutosCodbarras.belongsTo(models.Produtos);
  };

  sequelizePaginate.paginate(ProdutosCodbarras);

  return ProdutosCodbarras;
};
