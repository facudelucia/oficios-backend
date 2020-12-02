const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let userOficioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    apellido: {
        type: String,
        required: [true, 'El apellido es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String
    },
    description:{
        type: String,
        required: [true, 'La descripcion es necesaria']
    },
    phone:{
        type:Number,
        required: [true, "El numero de telefono es necesario"]
    },
    oficios:{
        type:String,
        required: [true, "El oficio es necesario"]
    },
    zona:{
        type:String,
        required: [true, "La zona es necesaria"]
    }
});


userOficioSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}


userOficioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });


module.exports = mongoose.model('UserOficio', userOficioSchema);