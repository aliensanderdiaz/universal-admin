const express = require('express');

let app = express();

let Pos = require('../models/pos.model');
let Resolucion = require('../models/resolucion.model');
let Impuesto = require('../models/impuesto.model');
let Inventario = require('../models/inventario.model');
let OrdenPos = require('../models/ordenespos.model');

const NUMERACION_PREFIJO = 'PRUE';
const NUMERACION_DESDE = 98000000;
const NUMERACION_HASTA = 99000000;


app.get('/pos', (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Pos
        .find()
        .populate('clienteId', 'nombre')
        .sort({ nombre: 1 })
        .skip(desde)
        .limit(8)
        .exec((err, ventas) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Pos.countDocuments({}, (err, conteo) => {
                res.json({
                    ok: true,
                    ventas,
                    total: conteo
                });
            })

        })
});

app.get('/pos-lista-completa', (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Pos
        .find()
        .populate('cliente')
        .sort({ nombre: 1 })
        .exec((err, ventas) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                ventas
            });


        })
});

app.post('/pos', (req, res) => {

    const venta = new Pos(req.body);
    venta['resolucion'] = '5d925527fa7de21cec9d9864';

    // console.log({ venta })

    Resolucion.findOne({ _id: '5d925527fa7de21cec9d9864' }).exec((err, resolucion) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: 'No se pueden contar los registros'
            })
        }

        const hoy = new Date();

        if (hoy > resolucion.fechaInicio && hoy < resolucion.fechaVencimiento) {

            Pos.countDocuments({ resolucion: '5d925527fa7de21cec9d9864' }, (err, count) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err: 'No se pueden contar los registros'
                    })
                }

                let numeroDeFactura = resolucion.numeracionInicial + count + 1;

                if (numeroDeFactura > resolucion.numeracionFinal) {
                    console.log('ENTRO AL IF');

                    return res.status(500).json({
                        ok: false,
                        err: 'No se puede generar mas facturas con esta numeración'
                    })
                }

                venta.numeroDeFactura = numeroDeFactura;
                venta.comprobante = resolucion.prefijo + numeroDeFactura;
                // console.log(venta);

                venta.save((err, ventaDB) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    }

                    // res.status(201).json({
                    //     ok: true,
                    //     venta: ventaDB
                    // });

                    // Pos.findById(ventaDB._id)
                    //     .populate('cliente', 'primerNombre apellidos razonSocial nombreComercial numeroId tipoId')
                    //     .populate('vendedor', 'primerNombre apellidos numeroId')
                    //     .populate('productos.producto', 'nombre caracteristicas.referencia')
                    //     .populate('metodosDePago.metodoDePago')
                    //     .exec((err, ventaPopulada) => {
                    //         if (err) {
                    //             return res.status(500).json({
                    //                 ok: false,
                    //                 err
                    //             });
                    //         }

                    //         res.json({
                    //             ok: true,
                    //             venta: ventaPopulada
                    //         });

                    //     })


                    /*
                    // MODIFICAR LA ORDEN A COMPLETADA Y LOS INVENTARIOS
                    */

                    console.log({ORDENID: req.body.ordenId})

                    OrdenPos.findOneAndUpdate({ _id: req.body.ordenId }, { etiqueta: 'COMPLETADA' }, (errorOrden, ordenActualizada) => {
                        // OrdenPos.findOne({ _id: req.body.ordenId }, (errorOrden, ordenActualizada) => {
                        if (errorOrden) {
                            return res.status(500).json({
                                ok: false,
                                err: errorOrden
                            });
                        }

                        req.body.productos.forEach(element => {
                            Inventario.findOne({ producto: element.producto }, (errorInventario, inventario) => {
                                if (errorInventario) {
                                    return res.status(500).json({
                                        ok: false,
                                        err: errorInventario
                                    });
                                }

                                const movimiento = {
                                    stockInicial: inventario.stock,
                                    stockFinal: inventario.stock - element.cantidad,
                                    cantidad: element.cantidad,
                                    fecha: Date.now(),
                                    precio: element.valorUnidad,
                                    venta: ventaDB._id,
                                    tipo: 'Venta'
                                }

                                inventario.movimientos.push(movimiento);
                                inventario.stock -= element.cantidad;

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

                        return res.json({
                            ok: true,
                            mensaje: 'TODO HA SALIDO BIEN'
                        });

                        // res.json({
                        //     ok: true,
                        //     venta: ventaDB,
                        //     orden: ordenActualizada
                        // });
                    })


                })
            })


        } else {
            res.status(400).json({
                ok: false,
                mensaje: 'No estás entre las fechas indicadas'
            })
        }

    })

    // Pos.countDocuments({}, (err, count) => {
    //     if (err) {
    //         return res.status(500).json({
    //             ok: false,
    //             err: 'No se pueden contar los registros'
    //         })
    //     }

    //     let numeroDeFactura = NUMERACION_DESDE + count + 1;

    //     if (numeroDeFactura > NUMERACION_HASTA) {
    //         console.log('ENTRO AL IF');

    //         return res.status(500).json({
    //             ok: false,
    //             err: 'No se puede generar mas facturas con esta numeración'
    //         })
    //     }

    //     venta.numeroDeFactura = NUMERACION_PREFIJO + numeroDeFactura;
    //     // console.log(venta);

    //     venta.save((err, ventaDB) => {
    //         if (err) {
    //             return res.status(500).json({
    //                 ok: false,
    //                 err
    //             });
    //         }

    //         res.status(201).json({
    //             ok: true,
    //             venta: ventaDB
    //         });
    //     })
    // })

});

app.get('/pos/:id', (req, res) => {
    Pos
        .findById(req.params.id)
        .populate('cliente')
        .populate('productos.producto', 'nombre caracteristicas.referencia')
        .populate('vendedor', 'primerNombre apellidos')
        .exec((err, venta) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                venta,
            })
        })
});

function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
}


app.get('/informe-diario/:queryFecha', (req, res) => {

    let queryFecha = req.params.queryFecha;

    if (queryFecha.length !== 10) {
        return res.status(500).json({
            ok: false,
            err: 'No se puede leer la fecha - Falta de caracteres.'
        });
    }

    let fecha = new Date(req.params.queryFecha);
    console.log({ fecha })

    if (!isValidDate(fecha)) {
        return res.status(500).json({
            ok: false,
            err: 'No se puede leer la fecha - El Dato no es una fecha.'
        });
    }

    let fechaSiguiente = new Date(req.params.queryFecha);
    fechaSiguiente.setDate(fecha.getDate() + 2);
    console.log({ fechaSiguiente })

    Pos
        .find({
            fechaDeFactura: {
                $gte: fecha,
                $lte: fechaSiguiente
            }
        })
        .sort('numeroDeFactura')
        .populate({
            path: 'productos.producto',
            select: 'grupo_de_inventario',
            populate: { path: 'grupo_de_inventario' }
        })
        .populate({
            path: 'productos.producto',
            select: 'impuesto',
            populate: { path: 'impuesto' }
        })
        .populate({
            path: 'impuestos.impuesto'
        })
        .populate({
            path: 'metodosDePago.metodoDePago'
        })
        .exec((err, ventas) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            const TOTAL = ventas.reduce((venta1, venta2) => venta1.total + venta2.total)

            Resolucion
                .findOne({ _id: req.query.resolucion })
                .populate({
                    path: 'metodosDePago',
                    select: 'nombre'
                })
                .exec((err, resolucion) => {

                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    }

                    const METODOS_DE_PAGO = resolucion.metodosDePago.map(
                        metodoDePago => {
                            return {
                                _id: metodoDePago._id,
                                nombre: metodoDePago.nombre,
                                transacciones: 0,
                                total: 0,
                            };
                        }
                    )

                    Impuesto.find().exec((err, impuestos) => {
                        if (err) {
                            return res.status(500).json({
                                ok: false,
                                err
                            });
                        }

                        const IMPUESTOS = impuestos.map(
                            impuesto => {
                                return {
                                    _id: impuesto._id,
                                    nombre: impuesto.nombre,
                                    codigo: impuesto.codigo,
                                    tarifa: impuesto.tarifa,
                                    baseGravable: 0,
                                    total: 0,
                                };
                            }
                        )


                        res.json({
                            ok: true,
                            ventas,
                            primeraVenta: ventas[0].numeroDeFactura,
                            ultimaVenta: ventas[ventas.length - 1].numeroDeFactura,
                            totalVentas: TOTAL,
                            cantidadDeTransacciones: ventas.length,
                            fecha: queryFecha,
                            hora: req.query.hora,
                            metodosDePago: METODOS_DE_PAGO,
                            impuestos: IMPUESTOS
                        });
                    })

                })

        })

});


module.exports = app;