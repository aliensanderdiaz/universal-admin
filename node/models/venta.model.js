const mongoose = require('mongoose')
const Schema = mongoose.Schema

// var CounterSchema = Schema({
//     _id: { type: String, required: true },
//     seq: { type: Number, default: 0 }
// });
// var counter = mongoose.model('counter', CounterSchema);


const VentaSchema = Schema({
    fechaDeFactura: { type: Date, default: Date.now },
    clienteId: { type: Schema.ObjectId, ref: 'Usuario' },
    numeroDeFactura: { type: String },
    productos: [{
        _id: false,
        productoId: { type: Schema.ObjectId, ref: 'Producto' },
        cantidad: { type: Number },
        valorFijo: { type: Number },
        valorVenta: { type: Number },
        valorTotal: { type: Number }
    }],
    total: { type: Number },
    subtotal: { type: Number },
    iva: { type: Number }
})

// const Venta = mongoose.model('Venta', VentaSchema);

// VentaSchema.pre('save', function(next) {
//     var doc = this;

//     Venta.countDocuments({}, function(err, count) {
//         if (err) {
//             return next(err);
//         }
//         doc.numeroDeFactura = count + 1;
//         next();
//     });
// });

module.exports = mongoose.model('Venta', VentaSchema)