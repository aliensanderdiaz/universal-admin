const mongoose = require('mongoose')
const Schema = mongoose.Schema

// const PosSchema = Schema({
//     fechaDeFactura: { type: Date, default: Date.now },
//     clienteId: { type: Schema.ObjectId, ref: 'Usuario' },
//     numeroDeFactura: { type: String },
//     productos: [{
//         _id: false,
//         nombre: { type: String },
//         referencia: { type: String },
//         productoId: { type: Schema.ObjectId, ref: 'Producto' },
//         cantidad: { type: Number },
//         valorFijo: { type: Number },
//         valorVenta: { type: Number },
//         valorTotal: { type: Number }
//     }],
//     total: { type: Number },
//     subtotal: { type: Number },
//     iva: { type: Number },
//     efectivo: { type: Number },
//     cambio: { type: Number },
//     metodoPago: { type: String }
// })

const PosSchema = Schema({
    fechaDeFactura: { type: Date, default: Date.now },
    resolucion: { type: Schema.ObjectId, ref: 'Resolucion' },
    cliente: { type: Schema.ObjectId, ref: 'Usuario' },
    vendedor: { type: Schema.ObjectId, ref: 'Usuario' },
    numeroDeFactura: { type: Number },
    comprobante: { type: String },
    productos: [{
        _id: false,
        producto: { type: Schema.ObjectId, ref: 'Producto' },
        cantidad: { type: Number },
        valorUnidad: { type: Number },
        valorNeto: { type: Number },
        impuesto: { type: Number },
        valorTotal: { type: Number }
    }],
    total: { type: Number },
    subtotal: { type: Number },
    // iva: { type: Number },
    impuestos: [{
        _id: false,
        impuesto: { type: Schema.ObjectId, ref: 'Impuesto' },
        valor: { type: Number }
    }],
    metodosDePago: [{
        _id: false,
        metodoDePago: { type: Schema.ObjectId, ref: 'MetodoDePago' },
        cantidad: { type: Number },
        comprobante: { type: String },
        cash: { type: Number },
        vueltas: { type: Number },
    }]
})

module.exports = mongoose.model('Pos', PosSchema)