const express = require('express');

const bcrypt = require('bcrypt');
const _ = require('underscore');

const UserOficio = require('../models/UserOficio');
const { verificaToken } = require('../middlewares/auth');

const app = express();
 

app.get('/useroficio', (req, res) => {


    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    UserOficio.find()
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            UserOficio.countDocuments((err, conteo) => {

                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });

            });


        });


});
app.get('/useroficio/:id', (req, res) => {
    let id = req.params.id;
    UserOficio.findOne({_id:id})
        .exec((err, user) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                user
            })
        })
})
app.get("/useroficio/buscar/:termino", (req,res)=>{
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    UserOficio.find({ oficios: regex })
        .exec((err, usuarios) => {


            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuarios
            })

        })
})
app.post('/useroficio', function(req, res) {

    let body = req.body;

    let usuario = new UserOficio({
        nombre: body.nombre,
        apellido: body.apellido,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        description: body.description,
        phone: body.phone,
        oficios: body.oficios,
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

app.put('/useroficio/:id', [verificaToken], function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', "apellido", 'email', 'img', 'description', 'phone', "oficios", "zona"]);

    UserOficio.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

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

app.delete('/useroficio/:id', [verificaToken], function(req, res) {


    let id = req.params.id;

    UserOficio.findByIdAndRemove(id, (err, usuarioBorrado) => {

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
