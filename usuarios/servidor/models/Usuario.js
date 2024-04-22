const mongoose = require('mongoose');

const UsuarioSchema = mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    rol: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);