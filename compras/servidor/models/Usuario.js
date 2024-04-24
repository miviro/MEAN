const mongoose = require('mongoose');

const UsuarioSchema = mongoose.Schema({
    rol: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);