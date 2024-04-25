const Producto = require('../models/Producto');
const axios = require('axios');
const ROL = 'admin';

async function fetchUserData(_id) {
    try {
        const response = await axios.get(`http://localhost:5000/api/usuarios/${_id}`);
        const responseBody = response.data;
        return responseBody.rol;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
    }
}

function assertCorrectRole(rol) {
    return rol === ROL;
}

exports.crearProducto = async(req, res) => {
    try {
        let { idOrigen } = req.query;
        if (assertCorrectRole((await fetchUserData(idOrigen)))) {
            let producto;
            producto = new Producto(req.body);
            await producto.save();
            res.send(producto);
        } else {
            return res.status(401).json({ msg: 'No autorizado' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};
exports.obtenerProductos = async(req, res) => {
    try {
        let { idOrigen } = req.query;
        if (assertCorrectRole((await fetchUserData(idOrigen)))) {
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
            const products = await Producto.find(query);
            res.json(products);
        } else {
            return res.status(401).json({ msg: 'No autorizado' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.obtenerProducto = async(req, res) => {
    try {
        let { idOrigen } = req.query;
        if (assertCorrectRole((await fetchUserData(idOrigen)))) {
            let producto = await Producto.findById(req.params.id);

            if (!producto) {
                res.status(404).json({ msg: 'No existe el producto' });
            }
            res.json(producto);
        } else {
            return res.status(401).json({ msg: 'No autorizado' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};

exports.eliminarProducto = async(req, res) => {
    try {
        let { idOrigen } = req.query;
        if (assertCorrectRole((await fetchUserData(idOrigen)))) {
            let producto = await Producto.findById(req.params.id);
            if (!producto) {
                res.status(404).json({ msg: 'No existe el producto' });
            }
            await Producto.deleteOne({ _id: req.params.id });
            res.json({ msg: 'Producto eliminado' });
        } else {
            return res.status(401).json({ msg: 'No autorizado' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};
exports.actualizarProducto = async(req, res) => {
    try {
        let { idOrigen } = req.query;
        if (assertCorrectRole((await fetchUserData(idOrigen)))) {
            const { color, hoja, tapa, precio, stock } = req.body;
            let producto = await Producto.findById(req.params.id);

            if (!producto) {
                res.status(404).json({ msg: 'No existe el producto' });
            }

            producto.color = color;
            producto.hoja = hoja;
            producto.tapa = tapa;
            producto.precio = precio;
            producto.stock = stock;

            producto = await Producto.findOneAndUpdate({
                _id: req.params.id
            }, producto, { new: true });

            res.json(producto);
        } else {
            return res.status(401).json({ msg: 'No autorizado' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};