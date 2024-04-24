const mongoose = require('mongoose');

const CompraSchema = mongoose.Schema({
    idArticulo: {
        type: String,
        required: true
    },
    idCliente: {
        type: String,
        required: true
    },
    cantidad: {
        type: Number,
        required: true
    },
    nombreComprador: {
        type: String,
        required: true
    },
    direccion: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Compra', CompraSchema);