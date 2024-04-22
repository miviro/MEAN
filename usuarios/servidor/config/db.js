const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });

const conectarDB = async() => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/compras");
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
            const colores = ['roja', 'azul', 'verde', 'amarilla', 'negra', 'blanca', 'naranja', 'violeta'];
            const hojas = ['pautada', 'cuadriculada', 'blanca'];
            const tapas = ['dura', 'blanda'];
            const Usuarios = [];
            for (let i = 0; i < 5; i++) {
                const color = colores[Math.floor(Math.random() * colores.length)];
                const hoja = hojas[Math.floor(Math.random() * hojas.length)];
                const tapa = tapas[Math.floor(Math.random() * tapas.length)];
                const precio = Math.floor(Math.random() * 1000) / 100;
                const stock = Math.floor(Math.random() * 100);
                const Usuario = new Usuario({ color, hoja, tapa, precio, stock });
                Usuarios.push(Usuario);
            }
            await Usuario.insertMany(Usuarios);
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