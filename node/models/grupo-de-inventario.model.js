var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var grupoDeInventarioSchema = new Schema({
    codigo: Number,
    nombre: String
});


module.exports = mongoose.model('GrupoDeInventario', grupoDeInventarioSchema);