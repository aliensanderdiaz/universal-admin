const express = require('express');

let app = express();

let Compra = require('../models/compra.model');
let Producto = require('../models/producto.model');

app.post('/compras', (req, res) => {

    const compra = new Compra(req.body);

    // console.log('compra');
    // console.log(compra);
    // console.log('compra');

    compra.save((err, compraDB) => {

        if (err) {
            console.log(err);
            
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear la compra',
                errors: err
            });
        }

        // console.log('compraDB');
        // console.log(compraDB);
        // console.log('compraDB');

        res.status(201).json({
            ok: true,
            compra: compraDB
        });


    });
});

app.get('/compras', (req, res) => {

    Compra
        .find({})
        .populate('supplier', 'primerNombre segundoNombre apellidos numeroId tipoId')
        .sort({supplierDate: 1})
        // .sort({supplierNumber: 1})
        .exec(
            (err, invoices) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando los proveedores',
                        errors: err
                    });
                } else {
                    res.status(200).json({
                        ok: true,
                        invoices: invoices
                    });
                }
            }
        )
});

app.get('/compras/:id', (req, res) => {

    console.log('PETICION UNA COMPRA');
    

    Compra
        .findById(req.params.id)
        .populate('supplier', 'primerNombre segundoNombre apellidos tipoId')
        .populate('products.productId', 'nombre caracteristicas.referencia')
        .populate('products.productos.productId', 'nombre caracteristicas.referencia')
        .exec((err, invoice) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al buscar la compra',
                    errors: err
                });
            }

            res.status(201).json({
                ok: true,
                invoice: invoice
            });
        });
});

app.put('/compras/:id', (req, res) => {
    const compra = req.body;
    console.log({compra});

    Compra.findByIdAndUpdate(req.params.id, compra, (err, compraDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al Actualizar la compra',
                errors: err
            });
        }

        console.log('compraDB');
        console.log(compraDB);
        console.log('compraDB');

        res.status(201).json({
            ok: true,
            compra: compraDB
        });


    });
    
})

app.get('/historico-compras/:id', (req, res) => {
    console.log('HISTORICO-compra');
    Compra
        .find({
            'products.productId': req.params.id
        })
        .populate({
            path: 'products.productId',
            select: 'nombre'
        })
        .populate({
            path: 'products.productos.productId',
            select: 'nombre'
        })
        .exec((err, comprasDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al buscar las compras',
                    errors: err
                });
            }

            const respuestaCompras = [];

            if (comprasDB.length > 0) {

                comprasDB.forEach(element => {
                    
                    const compra = {
                        _id: element._id,
                        supplierDate: element.supplierDate,
                        products: element.products
                    }

                    respuestaCompras.push(compra)
                })

            }

    
            res.status(201).json({
                ok: true,
                compras: respuestaCompras
            });
    
    
        });
})

app.get('/historico-compras-2/:id', (req, res) => {
    console.log('HISTORICO-compra-2');
    Compra
        .find({
            'products.productId': req.params.id
        })
        .select('_id')
        .exec((err, comprasDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al buscar las compras',
                    errors: err
                });
            }

    
            res.status(201).json({
                ok: true,
                compras: comprasDB
            });
    
    
        });
})

app.get('/historico-combos/:id', (req, res) => {
    console.log('HISTORICO-combo');
    
    Compra
        .find({
            'products.productos.productId': req.params.id
        })
        .populate({
            path: 'products.productId',
            select: 'nombre'
        })
        .populate({
            path: 'products.productos.productId',
            select: 'nombre'
        })
        .exec((err, comprasDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al Actualizar la compra',
                    errors: err
                });
            }

            const respuestaCompras = [];

            if (comprasDB.length > 0) {

                comprasDB.forEach(element => {
                    
                    const compra = {
                        _id: element._id,
                        supplierDate: element.supplierDate,
                        products: element.products
                    }

                    respuestaCompras.push(compra)
                })

            }

    
            res.status(201).json({
                ok: true,
                combos: respuestaCompras
            });
    
    
        });
})

app.get('/historico-combos-2/:id', (req, res) => {
    console.log('HISTORICO-combo');
    
    Compra
        .find({
            'products.productos.productId': req.params.id
        })
        .select('_id')
        .exec((err, combosDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al Actualizar la compra',
                    errors: err
                });
            }



    
            res.status(201).json({
                ok: true,
                combos: combosDB
            });
    
    
        });
})

app.get('/historico-combos-compras/:id', (req, res) => {
    console.log('HISTORICO-combo-compras');
    
    Compra
        .find()
        .or([{
            'products.productId': req.params.id
        }, {
            'products.productos.productId': req.params.id
        }])
        .select('_id')
        .exec((err, combosDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al Actualizar la compra',
                    errors: err
                });
            }



    
            res.status(201).json({
                ok: true,
                combos: combosDB
            });
    
    
        });
})

app.get('/ejecutar-historico/:id', (req, res) => {
    
    const id = req.params.id;

    Compra
        .findById(id)
        .exec((err, invoice) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al buscar la compra',
                    errors: err
                });
            }

            const productos = invoice.products;
            console.log(productos.length);

            productos.forEach(
                producto => {
                    if (producto.etiqueta === 'Combo') {
                        producto.productos.forEach(
                            productoCombo => {
                                const historico = {
                                    cantidad: producto.qty,
                                    fecha: invoice.supplierDate,
                                    precio: producto.withTaxUnit,
                                    compra: invoice._id,
                                    tipo: 'Compra'
                                }
                                Producto.findOneAndUpdate(
                                    { _id: producto.productId },
                                    { $push: { historico: historico } },
                                    (err, producto) => {
                                        if (err) {
                                            return res.status(400).json({
                                                ok: false,
                                                mensaje: 'Error al agregar historico a la compra',
                                                errors: err
                                            });
                                        }
                                    }
                                )
                            }
                        )
                    } else {
                        const historico = {
                            cantidad: producto.qty,
                            fecha: invoice.supplierDate,
                            precio: producto.withTaxUnit,
                            compra: invoice._id,
                            tipo: 'Compra'
                        }
                        Producto.findOneAndUpdate(
                            { _id: producto.productId },
                            { $push: { historico: historico } },
                            (err, producto) => {
                                if (err) {
                                    return res.status(400).json({
                                        ok: false,
                                        mensaje: 'Error al agregar historico a la compra',
                                        errors: err
                                    });
                                }
                            }
                        )
                    }
                }
            )

            // for (const producto in productos) {
            //     console.log('Producto');
                
            // }
            

            res.status(201).json({
                ok: true,
                respuesta: productos
            });
        });
})

app.post('/factura-completada/:id', (req, res) => {
    Compra
        .findOneAndUpdate({ _id: req.params.id }, { completada: true }, (err, venta) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al marcar la factura como completada.',
                });
            } else {
                res.status(200).json({
                    ok: true,
                    venta: venta
                });
            }
        })
})

app.get('/compras-filtradas', (req, res) => {

    let desde = req.query.desde || new Date(2000,01,01);
    let hasta = req.query.hasta || Date.now();

    console.log({Desde: desde, Hasta: hasta});
    

    Compra
        .find({
            "supplierDate": {
                "$gte": desde, 
                "$lte": hasta
            }
        })
        .populate('supplier', 'primerNombre segundoNombre apellidos numeroId tipoId')
        // .sort({supplierDate: 1})
        .sort({supplierNumber: 1})
        .exec(
            (err, invoices) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando los proveedores',
                        errors: err
                    });
                } else {
                    res.status(200).json({
                        ok: true,
                        invoices: invoices
                    });
                }
            }
        )
});

app.get('/compras-filtradas-proveedor', (req, res) => {

    let desde = req.query.desde || new Date(2000,01,01);
    let hasta = req.query.hasta || Date.now();
    let proveedorId = req.query.proveedorId;

    console.log({Desde: desde, Hasta: hasta});
    

    Compra
        .find({
            'supplierDate': {
                '$gte': desde, 
                '$lte': hasta
            },
            'supplier': proveedorId

        })
        .populate('supplier', 'primerNombre segundoNombre apellidos numeroId tipoId')
        // .sort({supplierDate: 1})
        .sort({supplierNumber: 1})
        .exec(
            (err, invoices) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando los proveedores',
                        errors: err
                    });
                } else {
                    res.status(200).json({
                        ok: true,
                        invoices: invoices
                    });
                }
            }
        )
});

module.exports = app;