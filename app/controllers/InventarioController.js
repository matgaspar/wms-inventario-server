const {
  Sequelize, Inventario, Contagem, ProdutosInventario, Empresa,
} = require('../models');
const { ReS, ReE, to } = require('../services/util.service');
const { Pagination } = require('../config');

const { Op } = Sequelize;


module.exports = {
  async index(req, res) {
    try {
      // console.log('======[USER EMPRESA]======', req.user.Empresas[0].id);
      const { body } = req;
      const empresa = req.user.Empresas[0].id;
      const page = parseInt(body.page, 0) || Pagination.default.page;
      const paginate = parseInt(body.paginate, 0) || Pagination.default.paginate;
      const [err, inventario] = await to(
        Inventario.paginate({
          page,
          paginate,
          where: { empresa, finalizado: { [Op.not]: true } },
        }),
      );
      if (err) return ReE(res, err, 422);
      const { docs, ...totals } = inventario;

      return ReS(res, { data: docs || null, ...totals });
    } catch (err) {
      return ReE(res, err, 422);
    }
  },

  async create(req, res) {
    try {
      const usuario = req.user.id;
      const { id } = req.params;
      const {
        produto, contagem, quantidade,
      } = req.body;
      const [err, produtoinventario] = await to(
        ProdutosInventario.findOrCreate({
          where: {
            inventario: id,
            produtos: produto,
            contagem,
            usuario,
          },
          defaults: { quantidade },
        }).then(([produtoInvent, created]) => {
          if (!created) produtoInvent.increment('quantidade', { by: quantidade });
          return produtoInvent.reload();
        }),
      );
      if (err) return ReE(res, err, 422);
      return ReS(res, produtoinventario);
    } catch (err) {
      return ReE(res, err, 422);
    }
  },

  async read(req, res) {
    try {
      const { id } = req.params;
      const [err, produto] = await to(
        Inventario.findOne({
          where: { id },
        }),
      );
      if (err) return ReE(res, err, 422);
      return ReS(res, produto);
    } catch (err) {
      return ReE(res, err, 422);
    }
  },

  async getContagem(req, res) {
    try {
      const { id } = req.params;
      const [err, contagem] = await to(
        Contagem.findOne({
          where: { inventario: id, ativo: true, finalizado: { [Op.not]: true } },
        }),
      );
      if (err) return ReE(res, err, 422);
      return ReS(res, contagem);
    } catch (err) {
      return ReE(res, err, 422);
    }
  },
  async getInventarioEmpresa(req, res) {
    try {
      const { id } = req.params;
      const [err, inventarios] = await to(
        Inventario.findAll({
          where: {
            empresa: id,
            finalizado: {
              [Op.not]: true,
            },
          },
        }),
      );
      if (err) return ReE(res, err, 422);
      return ReS(res, inventarios);
    } catch (err) {
      return ReE(res, err, 422);
    }
  },
};
