const express = require('express');
const router = express.Router();
const compraController = require('../controllers/compraController');

// api/compras
router.get('/', compraController.obtenerCompras);
router.post('/', compraController.crearCompra);
router.put('/:id', compraController.actualizarCompra);
router.get('/:id', compraController.obtenerCompra);
router.delete('/:id', compraController.eliminarCompra);

module.exports = router;