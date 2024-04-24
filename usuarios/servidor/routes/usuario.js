const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// api/usuarios
router.get('/', usuarioController.obtenerUsuarios);
router.post('/', usuarioController.crearUsuario);
router.delete('/:id', usuarioController.eliminarUsuario);
router.get('/:id', usuarioController.obtenerRolUsuario);


module.exports = router;