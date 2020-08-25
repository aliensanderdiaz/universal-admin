var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var impuestoSchema = new Schema({
    codigo: Number,
    nombre: String,
    tarifa: Number
});


module.exports = mongoose.model('Impuesto', impuestoSchema);