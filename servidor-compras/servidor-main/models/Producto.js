const mongoose = require('mongoose');
const colores = ['roja', 'azul', 'verde', 'amarilla', 'negra', 'blanca', 'naranja', 'violeta'];
const hojas = ['pautada', 'cuadriculada', 'blanca'];
const tapa = ['dura', 'blanda'];

const ProductoSchema = mongoose.Schema({
    color: {
        type: String,
        required: true,
        //enum: colores
    },
    hoja: {
        type: String,
        required: true,
        //enum: hojas
    },
    tapa: {
        type: String,
        required: true,
        //enum: tapa
    },
    precio: {
        type: Number,
        required: true/*,
        validate: {
            validator: function(value) {
                // Check if value is a positive float
                return typeof value === 'number' && value > 0 && Number.isFinite(value);
            },
            message: 'Precio must be a positive float value'
        }*/
    },
    stock: {
        type: Number,
        required: true,
        /*validate: {
            validator: function(value) {
                // Check if value is greater than or equal to zero
                return typeof value === 'number' && value >= 0 && Number.isInteger(value);
            },
            message: 'Stock must be an integer greater than or equal to zero'
        }*/
    }
});

module.exports = mongoose.model('Producto', ProductoSchema);