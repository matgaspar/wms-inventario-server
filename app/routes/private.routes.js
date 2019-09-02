const express = require('express');
const UsuarioController = require('../controllers/UsuarioController');
const EmpresaController = require('../controllers/EmpresaController');
const ProdutosController = require('../controllers/ProdutosController');
const InventarioController = require('../controllers/InventarioController');

const routes = new express.Router();

routes.get('/usuarios', UsuarioController.index);
routes.post('/usuario', UsuarioController.create);

routes.get('/empresas', EmpresaController.index);

routes.get('/produtos', ProdutosController.index);
routes.get('/produtos/:id', ProdutosController.read);
routes.get('/produtos/:codBarra/barcode', ProdutosController.readBarcode);

routes.get('/inventarios', InventarioController.index);
routes.get('/inventario/:id', InventarioController.read);
routes.get('/inventario/empresa/:id', InventarioController.getInventarioEmpresa);
routes.get('/inventario/:id/contagem', InventarioController.getContagem);

routes.post('/inventario/:id', InventarioController.create);

module.exports = routes;
