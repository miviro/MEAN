const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });

const conectarDB = async() => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/usuarios");
        console.log('DB Conectada');
    } catch (error) {
        console.log('Hubo un error');
        console.log(error);
        process.exit(1); // Detener la app
    }
}

module.exports = {
    conectarDB
};