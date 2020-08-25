const express = require('express');

let app = express();

let Proveedor = require('../models/proveedor.model');

app.post('/proveedores', (req, res) => {
    let body = req.body;

    console.log(body);

    let proveedor = new Proveedor({
        nombre: body.nombre,
        tipoId: body.tipoId,
        numeroId: body.numeroId,
        ciudad: body.ciudad,
        direccion: body.direccion,
        telefono: body.telefono,
    })

    proveedor.save((err, proveedorDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            proveedor: proveedorDB
        });
    })
});

app.get('/proveedores', (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Proveedor
        .find()
        .sort({ nombre: 1 })
        .skip(desde)
        .limit(8)
        .exec((err, proveedores) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Proveedor.countDocuments({}, (err, conteo) => {
                res.json({
                    ok: true,
                    proveedores,
                    total: conteo
                });
            })

        })
});

app.get('/proveedores-lista-completa', (req, res) => {

    Proveedor
        .find()
        .exec((err, proveedores) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }


            res.json({
                ok: true,
                proveedores
            });

        })
});

module.exports = app;