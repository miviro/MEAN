const Usuario = require('../models/Usuario');

exports.crearUsuario = async(req, res) => {
    try {
        let usuario = new Usuario(req.body);
        await usuario.save();
        res.send(usuario);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};
exports.obtenerUsuarios = async(req, res) => {
    try {
        const { idOrigen, id, rol } = req.query;
        let query = {};
        if (idOrigen != "admin") {
            return res.status(403).json({ message: 'No tienes permisos para realizar esta acción.' });
        }
        if (id) { query.id = id; }
        if (rol) { query.rol = rol; }

        const usuario = await Usuario.find(query);
        if (!usuario || usuario.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(usuario);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.obtenerRolUsuario = async(req, res) => {
    try {
        const { id } = req.params;
        let query = {};
        if (id) { query.id = id; }

        const usuario = await Usuario.findOne(query);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(usuario.rol);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

exports.eliminarUsuario = async(req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findOneAndDelete({ id });
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(usuario);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};