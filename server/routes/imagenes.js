const express = require("express")
const fs = require("fs")
const path = require("path")
let app = express()

app.get("/imagen/usuarios/:img", (req, res) => {
    let img = req.params.img

    let pathImagen = path.resolve(__dirname, `../../uploads/usuarios/${img}`)
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen)
    } 
})

module.exports = app