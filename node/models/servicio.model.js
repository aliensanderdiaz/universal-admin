var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var servicioSchema = new Schema({
    producto:  {
        type: Schema.ObjectId,
        ref: 'Producto'
    },
    cliente:  {
        type: Schema.ObjectId,
        ref: 'Usuario'
    },
    repuestos: [{
        type: Schema.ObjectId,
        ref: 'Producto'
    }],
    precio: Number,
    abono: Number,
    detalles: String,
    fechaDeIngreso: { type: Date, default: Date.now },
    tipo: {
        type: String,
        enum: [
            'revision',
            'reparacion',
            'garantia'
        ]
    },
    estados: {
        revision: {
            fecha: { type: Date },
            activo: { type: Boolean, default: false }
        },
        reparacion: {
            fecha: { type: Date },
            activo: { type: Boolean, default: false }
        },
        completado: {
            fecha: { type: Date },
            activo: { type: Boolean, default: false }
        },
        entregado: {
            fecha: { type: Date },
            activo: { type: Boolean, default: false }
        },
        declinado: {
            fecha: { type: Date },
            activo: { type: Boolean, default: false }
        },
    }
});


module.exports = mongoose.model('Servicio', servicioSchema);