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
exports.obtenerUsuarios = async(req, res) => {
    try {
        const { color, hoja, tapa, precio, stock, productId } = req.query;

        let query = {};

        // Handle color search
        if (color) {
            query.color = color;
        }

        // Handle hoja search
        if (hoja) {
            query.hoja = hoja;
        }

        // Handle tapa search
        if (tapa) {
            query.tapa = tapa;
        }

        // Handle precio search
        if (precio !== undefined) {
            query.precio = parseFloat(precio);
        }

        // Handle stock search
        if (stock !== undefined) {
            query.stock = parseFloat(stock);
        }

        // Handle product ID search
        if (productId) {
            query._id = productId;
        }
        const products = await Usuario.find(query);
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.obtenerUsuario = async(req, res) => {
    try {
        let usuario = await Usuario.findById(req.params.id);

        if (!usuario) {
            res.status(404).json({ msg: 'No existe el usuario' });
        }
        res.json(usuario);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};

exports.eliminarUsuario = async(req, res) => {
    try {
        let usuario = await Usuario.findById(req.params.id);
        if (!usuario) {
            res.status(404).json({ msg: 'No existe el usuario' });
        }
        await Usuario.deleteOne({ _id: req.params.id });
        res.json({ msg: 'Usuario eliminado' });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};
exports.actualizarUsuario = async(req, res) => {
    try {
        const { color, hoja, tapa, precio, stock } = req.body;
        let usuario = await Usuario.findById(req.params.id);

        if (!usuario) {
            res.status(404).json({ msg: 'No existe el usuario' });
        }

        usuario.color = color;
        usuario.hoja = hoja;
        usuario.tapa = tapa;
        usuario.precio = precio;
        usuario.stock = stock;

        usuario = await Usuario.findOneAndUpdate({
            _id: req.params.id
        }, usuario, { new: true });

        res.json(usuario);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};