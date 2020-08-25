const express = require('express');

let app = express();

let MetodoDePago = require('../models/metodo-de-pago.model');

app.post('/metodos-de-pago', (req, res) => {
    let body = req.body;

    console.log(body);

    let metodo_de_pago = new MetodoDePago({
        nombre: body.nombre,
        comprobante: body.comprobante
    })

    metodo_de_pago.save((err, metodo_de_pagoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            metodoDePago: metodo_de_pagoDB
        });
    })
});



module.exports = app;