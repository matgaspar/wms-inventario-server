const {
  Usuario, Empresa, UsuarioEmpresa,
} = require('../models');
const { ReS, ReE, to } = require('../services/util.service');
const { Pagination } = require('../config');

module.exports = {
  async index(req, res) {
    try {
      const { body } = req;
      const page = parseInt(body.page, 0) || Pagination.default.page;
      const paginate = parseInt(body.paginate, 0) || Pagination.default.paginate;
      // const { empresa } = req.user;
      const [err, usuarios] = await to(
        Usuario.paginate({
          page,
          paginate,
          include: [{ model: Empresa }],
        }),
      );
      if (err) return ReE(res, err, 422);
      const { docs, ...totals } = usuarios;

      return ReS(res, { data: docs || null, ...totals });
    } catch (err) {
      return ReE(res, err, 422);
    }
  },

  async create(req, res) {
    try {
      const {
        empresa, nome, email, login, senha, auditor, admin, ativo,
      } = req.body;
      const novoUsuario = {
        nome, email, login, senha, auditor, admin, ativo,
      };
      const [err, usuario] = await to(
        Usuario.create(novoUsuario).then((user) => {
          user.addEmpresa(empresa, { through: { ativo: 1 } });
          return user;
        }),
      );
      if (err) return ReE(res, err, 422);

      return ReS(res, usuario);
    } catch (err) {
      return ReE(res, err, 422);
    }
  },

  async read(req, res) {
    try {
      const { id } = req.params;
      const pessoa = await Usuario.findByPk(id);

      return res.json(pessoa);
    } catch (ex) {
      return res.json(ex);
    }
  },

  async login(login, empresa) {
    try {
      const usuario = await Usuario.findOne({
        where: { login },
        include: {
          model: Empresa,
          where: { id: empresa },
          through: { where: { ativo: 1 } },
          attributes: ['id', 'nome'],
        },
      });
      return usuario;
    } catch (ex) {
      return ex;
    }
  },

  async usuarioById(id, empresa) {
    const pessoa = await Usuario.findByPk(id, {
      include: {
        model: Empresa,
        where: { id: empresa },
        through: { where: { ativo: 1 } },
        attributes: ['id', 'nome'],
      },
    });
    return pessoa;
  },
};
