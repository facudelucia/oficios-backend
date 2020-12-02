const express = require("express");
const fileUpload = require("express-fileupload")
const app = express()
const fs = require("fs")
const path = require("path");
const UserOficio = require("../models/UserOficio");
app.use(fileUpload({ useTempFiles: true }));

app.put("/upload/usuarios/:id", function (req, res) {
    let id = req.params.id
    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: "no se ha seleccionado ningun archivo"
                }
            })
    }
    let archivo = req.files.archivo
    let nombreCortado = archivo.name.split(".")
    let extension = nombreCortado[nombreCortado.length -1]
    let extensionesValidas = ["png", "jpg", "jpeg", "gif","PNG", "JPG", "JPEG", "GIF",]
    if(extensionesValidas.indexOf(extension) < 0){
        return res.status(400).json({
            ok:false,
            err:{
                message: "las extensiones permitidas son "+extensionesValidas.join(", ") ,
                ext:extension
            }
        })
    }
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`
    archivo.mv(`uploads/usuarios/${nombreArchivo}`, (err)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }           
        imagenUsuario(id, res, nombreArchivo)
    })

})

function imagenUsuario(id, res, nombreArchivo)
{
    UserOficio.findById(id, (err, usuarioDB)=>{
        if(err){
            borraArchivo(nombreArchivo)
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if(!usuarioDB){
            borraArchivo(nombreArchivo)
            return res.status(400).json({
                ok:false,
                err:{
                    message:"usuario no existe"
                }
            })
        }
        borraArchivo(usuarioDB.img)
        usuarioDB.img = nombreArchivo
        usuarioDB.save((err, usuarioGuardado)=>{
            res.json({
                ok:true,
                usuario:usuarioGuardado,
                img:nombreArchivo
            })
        })
    })
}

function borraArchivo(nombreImagen){
    let pathImagen = path.resolve(__dirname, `../../uploads/usuarios/${nombreImagen}`)
    if(fs.existsSync(pathImagen)){
        fs.unlinkSync(pathImagen)
    }
}

module.exports = app
