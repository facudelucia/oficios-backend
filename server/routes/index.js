const express = require('express');

const app = express();

app.use(require('./oficio'));
app.use(require('./upload'));
app.use(require('./imagenes'));
app.use(require('./loginOficio'));
app.use(require('./userChanga'));
app.use(require('./loginChanga'));
app.use(require('./changas'));
module.exports = app;