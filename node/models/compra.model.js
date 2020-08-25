var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var compraSchema = new Schema({
    creationDate: { type: Date, default: Date.now },
    supplierDate: { type: Date },
    supplier: { type: Schema.ObjectId, ref: 'Usuario' },
    supplierNumber: { type: String },
    InvoiceNumber: { type: String },
    products: [{
        _id: false,
        beforeTax: { type: Number },
        discount: { type: Number },
        discount2: { type: Number },
        etiqueta: { type: String },
        productId: { type: Schema.ObjectId, ref: 'Producto' },
        qty: { type: Number },
        tax: { type: Number, default: 19 },
        unitValue: { type: Number },
        withTax: { type: Number },
        withTaxUnit: { type: Number },
        productos: [{
            _id: false,
            beforeTax: { type: Number },
            discount: { type: Number },
            discount2: { type: Number },
            productId: { type: Schema.ObjectId, ref: 'Producto' },
            qty: { type: Number },
            tax: { type: Number, default: 19 },
            unitValue: { type: Number },
            withTax: { type: Number },
            withTaxUnit: { type: Number }
        }]
    }],
    grossTotal: { type: Number },
    discounts: { type: Number },
    subtotal: { type: Number },
    iva: { type: Number, default: 19 },
    total: { type: Number },
    paymentMethod: { type: String },
    dueDate: { type: Date },
    completada: { type: Boolean },
});


compraSchema.pre('save', function (next) {
    if (this.isNew) {
        console.log(`THIS SUPPLIER DATE IN THE PRE ${this.supplierDate}`)
        this.supplierDate = new Date(this.supplierDate.getTime() + 1000 * 60 * 60 * 12);
        if (this.dueDate) {
            this.dueDate = new Date(this.dueDate.getTime() + 1000 * 60 * 60 * 12);
        }
        console.log(`THIS SUPPLIER DATE IN THE PRE ${this.supplierDate}`)
    }
    next();
})

module.exports = mongoose.model('Compra', compraSchema);