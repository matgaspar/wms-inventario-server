const { Produtos, ProdutosCodbarras, ProdutosImagens } = require('../models');
const { ReS, ReE, to } = require('../services/util.service');
const { Pagination } = require('../config');

module.exports = {
  async index(req, res) {
    try {
      const { body } = req;
      const page = parseInt(body.page, 0) || Pagination.default.page;
      const paginate = parseInt(body.paginate, 0) || Pagination.default.paginate;
      // const { empresa } = req.user;
      const [err, produtos] = await to(
        Produtos.paginate({
          page,
          paginate,
          // where: { '$ProdutosCodbarras.codBarra$': { [Op.like]: '%789%' } },
          include: [
            { model: ProdutosCodbarras, attributes: ['codBarra'] },
            { model: ProdutosImagens, attributes: ['imagem'] },
          ],
        }),
      );
      if (err) return ReE(res, err, 422);
      const { docs, ...totals } = produtos;

      return ReS(res, { data: docs || null, ...totals });
    } catch (err) {
      return ReE(res, err, 422);
    }
  },

  async read(req, res) {
    try {
      const { id } = req.params;
      const [err, produto] = await to(
        Produtos.findOne({
          where: { id },
          include: [
            { model: ProdutosCodbarras, attributes: ['codBarra'] },
            { model: ProdutosImagens, attributes: ['imagem'] },
          ],
        }),
      );
      if (err) return ReE(res, err, 422);
      return ReS(res, produto);
    } catch (err) {
      return ReE(res, err, 422);
    }
  },

  async readBarcode(req, res) {
    try {
      const { codBarra } = req.params;
      const [err, produto] = await to(
        Produtos.findOne({
          include: [
            { model: ProdutosCodbarras, where: { codBarra }, attributes: ['codBarra'] },
            { model: ProdutosImagens, attributes: ['imagem'] },
          ],
        }),
      );
      if (err) return ReE(res, err, 422);
      return ReS(res, produto);
    } catch (err) {
      return ReE(res, err, 422);
    }
  },
};
