const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });

const conectarDB = async() => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/mean");
        console.log('DB Conectada');
    } catch (error) {
        console.log('Hubo un error');
        console.log(error);
        process.exit(1); // Detener la app

    }
}

const poblarDB = async() => {
    try {
        const Producto = require('../models/Producto');
        const productos = await Producto.find();
        if (productos.length === 0) {
            const colores = ['roja', 'azul', 'verde', 'amarilla', 'negra', 'blanca', 'naranja', 'violeta'];
            const hojas = ['pautada', 'cuadriculada', 'blanca'];
            const tapas = ['dura', 'blanda'];
            const productos = [];
            for (let i = 0; i < 5; i++) {
                const color = colores[Math.floor(Math.random() * colores.length)];
                const hoja = hojas[Math.floor(Math.random() * hojas.length)];
                const tapa = tapas[Math.floor(Math.random() * tapas.length)];
                const precio = Math.floor(Math.random() * 1000) / 100;
                const stock = Math.floor(Math.random() * 100);
                const producto = new Producto({ color, hoja, tapa, precio, stock });
                productos.push(producto);
            }
            await Producto.insertMany(productos);
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