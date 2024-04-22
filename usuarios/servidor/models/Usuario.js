const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const UsuarioSchema = mongoose.Schema({
    rol: {
        type: String,
        required: true,
    }
});
UsuarioSchema.plugin(AutoIncrement, { inc_field: 'id' });

module.exports = mongoose.model('Usuario', UsuarioSchema);