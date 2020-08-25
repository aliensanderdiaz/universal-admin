const express = require('express');

let app = express();

let Inventario = require('../models/inventario.model');
let Producto = require('../models/producto.model');
let Compra = require('../models/compra.model');

app.post('/inventarios', (req, res) => {

    console.log({body: JSON.stringify(req.body)});

    const INVENTARIO = req.body;

    Inventario.findOne({ producto: INVENTARIO.producto },(err, inventario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (inventario) {
            return res.json({
                ok: false,
                err: 'Ya existe un inventario creado para ese producto.'
            });
        }

        let nuevo_inventario = new Inventario({
            producto: INVENTARIO.producto,
            stock: INVENTARIO.stock,
            movimientos: INVENTARIO.movimientos
        })

        nuevo_inventario.save((err, inventarioDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.status(201).json({
                ok: true,
                inventario: inventarioDB
            });
        })


    })
})

app.get('/inventarios/consulta-individual/:referencia', (req, res) => {


    Producto
        .findOne({
            'caracteristicas.referencia': req.params.referencia
        }, 'nombre')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!producto) {
                return res.json({
                    ok: false,
                    err: 'No se encontró un producto con la referencia ' + req.params.ref
                });
            }

            Inventario.findOne({ producto: producto._id})
                .populate('producto', 'nombre')
                .exec((err, inventarioDB) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    }
            
                    res.status(201).json({
                        ok: true,
                        inventario: inventarioDB
                    });
                })

        })



})


app.get('/inventarios/ejecutar-historico/:compraId', (req, res) => {
    const id = req.params.compraId;

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
            // console.log(productos.length);
            // console.log({productos: JSON.parse(JSON.stringify(productos))});

            // return;

            productos.forEach(
                producto => {
                    if (producto.etiqueta === 'Combo') {
                        producto.productos.forEach(element => {
                            Inventario.findOne({ producto: element.productId }, (errorInventario, inventario) => {
                                if (errorInventario) {
                                    return res.status(500).json({
                                        ok: false,
                                        err: errorInventario
                                    });
                                }

                                const movimiento = {
                                    stockInicial: inventario.stock,
                                    stockFinal: inventario.stock + element.qty,
                                    cantidad: element.qty,
                                    fecha: Date.now(),
                                    precio: element.withTaxUnit,
                                    compra: invoice._id,
                                    tipo: 'Compra'
                                }

                                inventario.movimientos.push(movimiento);
                                inventario.stock += element.qty;

                                inventario.save((errorInventarioModificado, inventarioModificado) => {
                                    if (errorInventario) {
                                        return res.status(500).json({
                                            ok: false,
                                            err: errorInventarioModificado
                                        });
                                    }


                                })
                            })
                        });
                    } else {
                        // const historico = {
                        //     cantidad: producto.qty,
                        //     fecha: invoice.supplierDate,
                        //     precio: producto.withTaxUnit,
                        //     compra: invoice._id,
                        //     tipo: 'Compra'
                        // }
                        // Producto.findOneAndUpdate(
                        //     { _id: producto.productId },
                        //     { $push: { historico: historico } },
                        //     (err, producto) => {
                        //         if (err) {
                        //             return res.status(400).json({
                        //                 ok: false,
                        //                 mensaje: 'Error al agregar historico a la compra',
                        //                 errors: err
                        //             });
                        //         }
                        //     }
                        // )


                        Inventario.findOne({ producto: producto.productId }, (errorInventario, inventario) => {

                            // console.log({inventario: JSON.parse(JSON.stringify(inventario))});
                            // console.log({producto: JSON.parse(JSON.stringify(producto))});

                            // return;
                            if (errorInventario) {
                                return res.status(500).json({
                                    ok: false,
                                    err: errorInventario
                                });
                            }

                            const movimiento = {
                                stockInicial: inventario.stock,
                                stockFinal: inventario.stock + producto.qty,
                                cantidad: producto.qty,
                                fecha: Date.now(),
                                precio: producto.withTaxUnit,
                                compra: invoice._id,
                                tipo: 'Compra'
                            }

                            inventario.movimientos.push(movimiento);
                            inventario.stock += producto.qty;

                            inventario.save((errorInventarioModificado, inventarioModificado) => {
                                if (errorInventario) {
                                    return res.status(500).json({
                                        ok: false,
                                        err: errorInventarioModificado
                                    });
                                }


                            })
                        })
                    
                    }
                }
            )            

            res.status(201).json({
                ok: true,
                respuesta: productos
            });
        });
})

// app.post('/resoluciones', (req, res) => {
//     let body = req.body;

//     console.log(body);

//     let resolucion = new Resolucion({
//         nombre: body.nombre,
//         prefijo: body.prefijo,
//         numeracionInicial: body.numeracionInicial,
//         numeracionFinal: body.numeracionFinal,
//         fechaInicio: body.fechaInicio,
//         fechaVencimiento: body.fechaVencimiento,
//         activo: body.activo,
//         metodosDePago: body.metodosDePago,
//     })

//     resolucion.save((err, resolucionDB) => {
//         if (err) {
//             return res.status(500).json({
//                 ok: false,
//                 err
//             });
//         }

//         res.status(201).json({
//             ok: true,
//             resolucion: resolucionDB
//         });
//     })
// });

// app.get('/resoluciones', (req, res) => {
//     Resolucion.findOne({ activo: true})
//         .populate('metodosDePago')
//         .exec((err, resolucionDB) => {
//             if (err) {
//                 return res.status(500).json({
//                     ok: false,
//                     err
//                 });
//             }
    
//             res.status(201).json({
//                 ok: true,
//                 resolucion: resolucionDB
//             });
//         })
// })



module.exports = app;