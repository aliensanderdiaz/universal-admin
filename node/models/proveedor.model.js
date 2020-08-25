var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var proveedorSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    tipoId: { type: String, required: [true, 'El tipo de Id es necesario'] },
    numeroId: { type: String, required: [true, 'El número de Id es necesario'] },
    ciudad: { type: String, required: [true, 'La ciudad es necesaria'] },
    direccion: { type: String, required: [true, 'La dirección es necesaria'] },
    telefono: { type: String, required: [true, 'El teléfono es necesario'] }
});


module.exports = mongoose.model('Proveedor', proveedorSchema);