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

const poblarDB = async() => {
    try {
        const Usuario = require('../models/Usuario');
        const Usuarios = await Usuario.find();
        if (Usuarios.length === 0) {
            // creamos el admin, id 0
            const id = 0;
            const rol = "admin"
            const user = new Usuario({ id, rol });
            await user.save();
        }
    } catch (error) {
        console.log('Hubo un error');
        console.log(error);
        process.exit(1); // Detener la app
    }
}

module.exports = {
    conectarDB,
    poblarDB
};