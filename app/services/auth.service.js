const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const CONFIG = require('../config');
const { TE, to } = require('../services/util.service');
const UsuarioController = require('../controllers/UsuarioController');

module.exports = {
  async compareHash(senha, hash) {
    const compare = await to(bcrypt.compare(senha, hash));
    return compare;
  },

  async generateHash(senha) {
    let err;
    if (senha) {
      let salt;
      let hash;
      [err, salt] = await to(bcrypt.genSalt(10));
      if (err) TE(err.message, true);

      [err, hash] = await to(bcrypt.hash(senha, salt));
      if (err) TE(err.message, true);

      return hash;
    }
    return senha;
  },

  generateToken(payload) {
    const { secretOrKey, Options } = CONFIG.JWT;
    return jwt.sign(payload, secretOrKey, Options);
  },
};

const authentication = async (reqBody) => {
  // returns token
  const authInfo = {};
  authInfo.status = 'login';
  const { login, senha, empresa } = reqBody;

  if (!empresa) TE('Selecione uma empresa válida');

  if (!login) TE('Por favor, entre com um login válido');

  if (!senha) TE('Por favor, entre com uma senha válida');

  let usuario;
  let err;
  if (login) {
    authInfo.method = 'login';

    [err, usuario] = await to(UsuarioController.login(login, empresa));
    if (err) TE(err.message);
  } else {
    TE('A valid login was not entered');
  }

  if (!usuario) TE('Usuário não registrado');
  const [error, user] = await to(usuario.comparePassword(senha));

  if (error) TE(error.message);

  return user;
};

module.exports.authentication = authentication;
