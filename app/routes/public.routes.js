const express = require('express');
const EmpresaController = require('../controllers/EmpresaController');

const routes = new express.Router();

routes.get('/empresas', EmpresaController.index);

module.exports = routes;
