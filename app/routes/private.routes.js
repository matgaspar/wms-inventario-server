const express = require('express');
const UsuarioController = require('../controllers/UsuarioController');
const ProdutosController = require('../controllers/ProdutosController');
const InventarioController = require('../controllers/InventarioController');

const routes = new express.Router();

routes.get('/usuarios', UsuarioController.index);
routes.post('/usuario', UsuarioController.create);

routes.get('/produtos', ProdutosController.index);
routes.get('/produto/:id', ProdutosController.read);
routes.get('/produto/:codBarra/barcode', ProdutosController.readBarcode);

routes.get('/inventarios', InventarioController.index);
routes.get('/inventario/:id', InventarioController.read);
routes.get('/inventario/empresa/:id', InventarioController.getInventarioEmpresa);
routes.get('/inventario/:id/contagem', InventarioController.getContagem);
routes.get('/inventario/:id/produtos', InventarioController.getProdutosInventario);

routes.post('/inventario/:id', InventarioController.create);

module.exports = routes;
