const express = require('express');

const bcrypt = require('bcrypt');
const _ = require('underscore');

const UserChanga = require('../models/UserChanga');
const { verificaToken } = require('../middlewares/auth');

const app = express();
 

app.post('/userchanga', function(req, res) {

    let body = req.body;

    let usuario = new UserChanga({
        nombre: body.nombre,
        apellido: body.apellido,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        phone: body.phone,
        zona: body.zona
    });


    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });


    });


});

app.put('/userchanga/:id', [verificaToken], function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', "apellido", 'email', 'phone', "zona"]);

    UserChanga.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }



        res.json({
            ok: true,
            usuario: usuarioDB
        });

    })

});

app.delete('/userchanga/:id', [verificaToken], function(req, res) {


    let id = req.params.id;

    UserChanga.findByIdAndRemove(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    });



});



module.exports = app;
