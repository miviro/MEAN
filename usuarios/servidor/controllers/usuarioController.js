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
        const { idOrigen, _id, rol } = req.query;
        let query = {};
        if (idOrigen === undefined || idOrigen === null || idOrigen === "" || idOrigen === "undefined" || idOrigen === "null") {
            return res.status(400).json({ message: 'ID de origen no especificado' });
        }
        let rolOrigen = await obtenerRolDeID(idOrigen);
        if (rolOrigen != "admin") {
            return res.status(403).json({ message: 'No tienes permisos para realizar esta acción.' });
        }
        if (_id) { query._id = _id; }
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

async function obtenerRolDeID(_id) {
    let rol = (await Usuario.findById(_id)).rol;
    if (!rol || rol === "" || rol === null || rol === undefined || rol === "undefined" || rol === "null") {
        throw new Error('Rol no encontrado');
    }
    return rol;
}

exports.obtenerRolUsuario = async(req, res) => {
    const _id = req.params._id;
    try {
        res.json({ rol: await obtenerRolDeID(_id) });
    } catch (error) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }
}

exports.eliminarUsuario = async(req, res) => {
    try {
        const { _id } = req.params;
        const usuario = await Usuario.findOneAndDelete({ _id });
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(usuario);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};