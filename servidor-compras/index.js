const express = require('express');
const { conectarDB, poblarDB } = require('./config/db');
const cors = require("cors");

const app = express();

conectarDB();
poblarDB();
app.use(cors());


app.use(express.json());
app.use("/api/productos", require('./routes/producto'));


app.listen(4000, () => {
    console.log('Server is running on port 3000');
});