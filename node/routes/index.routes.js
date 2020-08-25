const express = require('express');

const app = express();

app.use(require('./marca.routes'));
app.use(require('./categoria.routes'));
app.use(require('./producto.routes'));
app.use(require('./proveedor.routes'));
app.use(require('./compra.routes'));
app.use(require('./usuario.routes'));
app.use(require('./venta.routes'));
app.use(require('./pos.routes'));
app.use(require('./ordenespos.routes'));
app.use(require('./hermandad.routes'));
app.use(require('./conectar.routes'));
app.use(require('./passport-local.routes'));
app.use(require('./metodos-de-pago.routes'));
app.use(require('./passport-local.routes'));
app.use(require('./resolucion.routes'));
app.use(require('./grupo-de-inventario.routes'));
app.use(require('./impuesto.routes'));
app.use(require('./inventario.routes'));

module.exports = app;