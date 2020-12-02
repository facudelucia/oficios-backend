const express = require('express');
require("dotenv").config();
const mongoose = require('mongoose');
const cors = require("cors");
const app = express();

const bodyParser = require('body-parser');
app.use(cors())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Configuración global de rutas
app.use(require('./routes/index'));



mongoose.connect(process.env.DB_CNN,  { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true,
    useFindAndModify: false
}, (err, res) => {
    if (err) throw err; 
    console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});

//jhK3hM0uCHdatr3e