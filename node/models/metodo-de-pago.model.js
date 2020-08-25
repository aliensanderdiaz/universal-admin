var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var metodoDePagoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    comprobante: { type: Boolean, default: false },
    cambio: { type: Boolean, default: false },
    duplicar: { type: Boolean, default: false }
});


module.exports = mongoose.model('MetodoDePago', metodoDePagoSchema);