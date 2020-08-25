var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var inventarioSchema = new Schema({
    producto: {
        type: Schema.ObjectId,
        ref: 'Producto'
    },
    stock: {
        type: Number,
        default: 0
    },
    movimientos: [{
        _id: false,
        stockInicial: Number,
        stockFinal: Number,
        cantidad: Number,
        fecha: Date,
        precio: Number,
        compra: {
            type: Schema.ObjectId,
            ref: 'Compra'
        },
        venta: {
            type: Schema.ObjectId,
            ref: 'Venta'
        },
        tipo: {
            type: String,
            enum: ['Compra', 'Venta', 'Saldo Inicial']
        }
    }],
});


module.exports = mongoose.model('Inventario', inventarioSchema);