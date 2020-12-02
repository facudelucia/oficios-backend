const express = require('express');
const { verificaToken } = require('../middlewares/auth');
const app = express();
const Changa = require("../models/Changa")
const _ = require('underscore');

app.post("/createchanga", verificaToken, function(req,res){
    const changa = new Changa(req.body)
    changa.creador = req.usuario._id
    changa.save((err, changaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            changa: changaDB
        });


    });

})
app.get("/getuserchangas", verificaToken, function(req,res){
    Changa.find({ creador: req.usuario._id }).sort({ create: -1 })
    .exec((err, changas) => {


        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            changas
        })

    })
})
app.get("/getallchangas", function(req,res){
    let desde = req.query.desde;
    desde = Number(desde);

    let limite = req.query.limite;
    limite = Number(limite);
    Changa.find()
        .skip(desde)
        .limit(limite)
        .sort({ create: -1 })
        .populate("creador", "nombre phone zona")
        .exec((err, changas) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            changas
        })

    })
})
app.put("/editchanga/:id", verificaToken, function(req,res){
    let id = req.params.id;
    let body = _.pick(req.body, ['title', "description", 'remuneracion']);

    Changa.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, changaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }



        res.json({
            ok: true,
            changa: changaDB
        });

    })
})

app.delete('/deletechanga/:id', [verificaToken], function(req, res) {
    let id = req.params.id;

    Changa.findByIdAndRemove(id, (err, changaBorrada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        if (!changaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'changa no encontrada'
                }
            });
        }
        res.json({
            ok: true,
            changa: changaBorrada
        });

    });
});
module.exports = app