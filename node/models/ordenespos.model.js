const mongoose = require('mongoose')
const Schema = mongoose.Schema

// const OrdenPosSchema = Schema({
//     fechaDeOrden: { type: Date, default: Date.now },
//     clienteId: { type: Schema.ObjectId, ref: 'Usuario' },
//     vendedor: { type: Schema.ObjectId, ref: 'Usuario' },
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
//     metodoPago: { type: String },
//     etiqueta: { type: String, required: [true, 'La etiqueta es necesaria'], enum: ['CREADA', 'RECHAZADA', 'COMPLETADA'] },
// })

const OrdenPosSchema = Schema({
    fechaDeOrden: { type: Date, default: Date.now },
    cliente: { type: Schema.ObjectId, ref: 'Usuario' },
    vendedor: { type: Schema.ObjectId, ref: 'Usuario' },
    productos: [{
        _id: false,
        producto: { type: Schema.ObjectId, ref: 'Producto' },
        cantidad: { type: Number },
        valorVenta: { type: Number }
    }],
    total: { type: Number },
    metodosDePago: [{
        _id: false,
        metodoDePago: { type: Schema.ObjectId, ref: 'MetodoDePago' },
        cantidad: { type: Number },
        comprobante: { type: String },
        cash: { type: Number },
        vueltas: { type: Number },
        comprobado: { type: Boolean, default: false }
    }],
    etiqueta: { type: String, required: [true, 'La etiqueta es necesaria'], enum: ['CREADA', 'RECHAZADA', 'COMPLETADA'] },
})

module.exports = mongoose.model('OrdenPos', OrdenPosSchema)