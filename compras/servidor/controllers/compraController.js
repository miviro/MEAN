const Compra = require('../models/Compra');
const Producto = require('../models/Producto');
const Usuario = require('../models/Usuario');
const axios = require('axios');
const ROL = 'cliente';

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

exports.crearCompra = async(req, res) => {
    try {
        let { idOrigen } = req.query;
        if (assertCorrectRole((await fetchUserData(idOrigen)))) {
            let compra;
            compra = new Compra(req.body);
            if (idOrigen !== req.body.idUsuario) {
                return res.status(401).json({ msg: 'El ID de origen y el del cliente debe ser el mismo' });
            }

            let stockDisponible = (await Producto.findById(compra.idArticulo)).stock;
            if (stockDisponible < req.body.cantidad) {
                return res.status(400).json({ msg: 'No hay suficiente stock' });
            }

            if (req.body.idUsuario) {
                const usuario = await Usuario.findById(req.body.idUsuario);
                if (!usuario) {
                    return res.status(400).json({ msg: 'Cliente no encontrado' });
                }
            }
            await compra.save();
            // actualizar stock
            stockDisponible -= req.body.cantidad;
            await Producto.findByIdAndUpdate(compra.idArticulo, { stock: stockDisponible });
            res.send(compra);
        } else {
            return res.status(401).json({ msg: 'No autorizado' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};

exports.obtenerCompras = async(req, res) => {
    try {
        let { idOrigen } = req.query;
        if (assertCorrectRole((await fetchUserData(idOrigen)))) {
            const { idArticulo, idCliente, cantidad, nombreComprador, direccion } = req.query;

            let query = {};

            if (idArticulo) { query.idArticulo = idArticulo; }
            if (idCliente) { query.idCliente = idCliente; }
            if (cantidad !== undefined) { query.cantidad = parseFloat(cantidad); }
            if (nombreComprador) { query.nombreComprador = nombreComprador; }
            if (direccion) { query.direccion = direccion; }

            const products = await Compra.find(query);
            res.json(products);
        } else {
            return res.status(401).json({ msg: 'No autorizado' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.obtenerProductos = async(req, res) => {
    try {
        let { idOrigen } = req.query;
        if (assertCorrectRole((await fetchUserData(idOrigen)))) {
            const { color, hoja, tapa, precio, stock, productId } = req.query;

            let query = {};

            if (color) { query.color = color; }
            if (hoja) { query.hoja = hoja; }
            if (tapa) { query.tapa = tapa; }
            if (precio !== undefined) { query.precio = parseFloat(precio); }
            if (stock !== undefined) { query.stock = parseFloat(stock); }
            if (productId) { query._id = productId; }

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

exports.obtenerCompra = async(req, res) => {
    try {
        let { idOrigen } = req.query;
        if (assertCorrectRole((await fetchUserData(idOrigen)))) {
            let compra = await Compra.findById(req.params.id);

            if (!compra) {
                res.status(404).json({ msg: 'No existe el compra' });
            }
            res.json(compra);
        } else {
            return res.status(401).json({ msg: 'No autorizado' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};

exports.eliminarCompra = async(req, res) => {
    try {
        let { idOrigen } = req.query;
        if (assertCorrectRole((await fetchUserData(idOrigen)))) {
            let compra = await Compra.findById(req.params.id);
            if (!compra) {
                res.status(404).json({ msg: 'No existe el compra' });
            }
            await Compra.deleteOne({ _id: req.params.id });
            res.json({ msg: 'Compra eliminado' });
        } else {
            return res.status(401).json({ msg: 'No autorizado' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};
exports.actualizarCompra = async(req, res) => {
    try {
        let { idOrigen } = req.query;
        if (assertCorrectRole((await fetchUserData(idOrigen)))) {
            const { nombreComprador, direccion } = req.body;
            let compra = await Compra.findById(req.params.id);

            if (!compra) {
                return res.status(404).json({ msg: 'No existe la compra' });
            }

            compra.nombreComprador = nombreComprador;
            compra.direccion = direccion;

            compra = await Compra.findOneAndUpdate({
                _id: req.params.id
            }, compra, { new: true });

            res.json(compra);
        } else {
            return res.status(401).json({ msg: 'No autorizado' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};