var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var resolucionSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    prefijo: { type: String },
    numeracionInicial: { type: Number },
    numeracionFinal: { type: Number },
    fechaInicio: { type: Date },
    fechaVencimiento: { type: Date },
    activo: { type: Boolean },
    metodosDePago: [{ type: Schema.ObjectId, ref: 'MetodoDePago' }]
});


module.exports = mongoose.model('Resolucion', resolucionSchema);