const { Empresa } = require('../models');
const { ReS, ReE, to } = require('../services/util.service');
const { Pagination } = require('../config');

module.exports = {
  async index(req, res) {
    try {
      const { body } = req;
      const page = parseInt(body.page, 0) || Pagination.default.page;
      const paginate = parseInt(body.paginate, 0) || Pagination.default.paginate;
      // const { empresa } = req.user;
      const [err, empresas] = await to(
        Empresa.paginate({
          page,
          paginate,
          // where: { empresa },
        }),
      );
      if (err) return ReE(res, err, 422);
      const { docs, ...totals } = empresas;

      return ReS(res, { data: docs || null, ...totals });
    } catch (err) {
      return ReE(res, err, 422);
    }
  },
};
