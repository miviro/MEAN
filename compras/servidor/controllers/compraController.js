const Compra = require('../models/Compra');
const Producto = require('../models/Producto');
const Usuario = require('../models/Usuario');

exports.crearCompra = async(req, res) => {
    try {
        let compra;
        compra = new Compra(req.body);

        let stockDisponible = (await Producto.findById(compra.idArticulo)).stock;
        if (stockDisponible < req.body.cantidad) {
            return res.status(400).json({ msg: 'No hay suficiente stock' });
        }

        if (req.body.idUsuario) {
            const usuario = await Usuario.findById(req.body.idUsuario);
            if (!usuario) {
                return res.status(400).json({ msg: 'Usuario no encontrado' });
            }
        }
        await compra.save();
        // actualizar stock
        stockDisponible -= req.body.cantidad;
        await Producto.findByIdAndUpdate(compra.idArticulo, { stock: stockDisponible });
        res.send(compra);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};

exports.obtenerCompras = async(req, res) => {
    try {
        const { idArticulo, idCliente, cantidad, nombreComprador, direccion } = req.query;

        let query = {};

        if (idArticulo) { query.idArticulo = idArticulo; }
        if (idCliente) { query.idCliente = idCliente; }
        if (cantidad !== undefined) { query.cantidad = parseFloat(cantidad); }
        if (nombreComprador) { query.nombreComprador = nombreComprador; }
        if (direccion) { query.direccion = direccion; }

        const products = await Compra.find(query);
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.obtenerProductos = async(req, res) => {
    try {
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
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.obtenerCompra = async(req, res) => {
    try {
        let compra = await Compra.findById(req.params.id);

        if (!compra) {
            res.status(404).json({ msg: 'No existe el compra' });
        }
        res.json(compra);
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};

exports.eliminarCompra = async(req, res) => {
    try {
        let compra = await Compra.findById(req.params.id);
        if (!compra) {
            res.status(404).json({ msg: 'No existe el compra' });
        }
        await Compra.deleteOne({ _id: req.params.id });
        res.json({ msg: 'Compra eliminado' });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};
exports.actualizarCompra = async(req, res) => {
    try {
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
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};