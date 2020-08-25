const express = require('express');

let app = express();

let Impuesto = require('../models/impuesto.model');

app.get('/impuesto', (req, res) => {

})

app.post('/impuesto', (req, res) => {

    let body = req.body;

    let impuesto = new Impuesto({
        nombre: body.nombre,
        codigo: body.codigo,
        tarifa: body.tarifa
    })

    impuesto.save((err, impuestoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            impuesto: impuestoDB
        });
    })

})

module.exports = app;