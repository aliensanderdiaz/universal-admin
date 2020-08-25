const express = require('express');

let app = express();

let OrdenPos = require('../models/ordenespos.model');

const passportConfig = require('../config/passport-local-auth');

app.get('/ordenes-pos', (req, res) => {

    OrdenPos
        .find({ etiqueta: 'CREADA' })
        // .populate('cliente', 'primerNombre apellidos razonSocial nombreComercial numeroId tipoId')
        .populate('cliente')
        .populate('vendedor', 'primerNombre apellidos numeroId')
        .populate({
            path: 'productos.producto',
            select: 'nombre caracteristicas.referencia grupo_de_inventario impuesto',
            populate: { path: 'impuesto grupo_de_inventario' }
        })
        .populate('metodosDePago.metodoDePago')
        .exec((err, ventas) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            OrdenPos.countDocuments({ etiqueta: 'CREADA' }, (err, conteo) => {
                res.json({
                    ok: true,
                    ventas,
                    total: conteo
                });
            })

        })
});

app.get('/ordenes-pos-lista-completa', (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    OrdenPos
        .find({ habilitado: true })
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

app.post('/ordenes-pos', passportConfig.estaAutenticado, (req, res) => {

    console.log('POS');
    // if(req.user) {
    //     // console.log(req.user);
    //     console.log('Si hay usuario');
    //     console.log(req.user)
    //     console.log(req.user._id);
    //     // console.log(JSON.parse(req.user));
    //     res.status(200).json({user: req.user})
    //     return;
    // }
    // console.log('No hay Usuario');
    
    // return res.status(404).json({ok: false})
    req.body.vendedor = req.user.idUser;
    console.log({ ORDEN: req.body })

    const venta = new OrdenPos(req.body);


    venta.save((err, ventaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        const io = req.app.get('io');
        io.emit('nuevaOrdenCreada');

        res.status(201).json({
            ok: true,
            venta: ventaDB
        });
    })

});

app.get('/ordenes-pos/:id', (req, res) => {
    OrdenPos
        .findById(req.params.id)
        .populate('cliente', 'primerNombre apellidos razonSocial nombreComercial numeroId tipoId')
        .populate('vendedor', 'primerNombre apellidos numeroId')
        .populate('productos.producto', 'nombre caracteristicas.referencia')
        .populate('metodosDePago.metodoDePago')
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

app.delete('/ordenes-pos/:id', (req, res) => {
    OrdenPos
        .findByIdAndDelete(req.params.id)
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

app.put('/ordenes-pos/:id', (req, res) => {
    OrdenPos
        .findByIdAndUpdate(req.params.id, req.body)
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

app.put('/ordenes-pos-deshabilitar/:id', (req, res) => {
    OrdenPos
        .findByIdAndUpdate(req.params.id, { habilitado: false })
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



module.exports = app;