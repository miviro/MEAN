const Usuario = require('../models/Usuario');

exports.crearUsuario = async(req, res) => {
    try {
        let usuario;
        usuario = new Usuario(req.body);
        await usuario.save();
        res.send(usuario);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};
exports.obtenerUsuario = async(req, res) => {
    try {
        // TODO:
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.obtenerUsuario = async(req, res) => {
    try {
        // TODO:
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};

exports.eliminarUsuario = async(req, res) => {
    try {
        // TODO:
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};
exports.actualizarUsuario = async(req, res) => {
    try {
        // TODO:
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};