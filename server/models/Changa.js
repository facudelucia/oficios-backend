const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let changaSchema = new Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    remuneracion: {
        type: String
    },
    creador:{
        type: Schema.Types.ObjectId, 
        ref: 'UserChanga'
    }
});


module.exports = mongoose.model('Changa', changaSchema);