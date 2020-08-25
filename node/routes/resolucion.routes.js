const express = require('express');

let app = express();

let Resolucion = require('../models/resolucion.model');

app.post('/resoluciones', (req, res) => {
    let body = req.body;

    console.log(body);

    let resolucion = new Resolucion({
        nombre: body.nombre,
        prefijo: body.prefijo,
        numeracionInicial: body.numeracionInicial,
        numeracionFinal: body.numeracionFinal,
        fechaInicio: body.fechaInicio,
        fechaVencimiento: body.fechaVencimiento,
        activo: body.activo,
        metodosDePago: body.metodosDePago,
    })

    resolucion.save((err, resolucionDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            resolucion: resolucionDB
        });
    })
});

app.get('/resoluciones', (req, res) => {
    Resolucion.findOne({ activo: true})
        .populate('metodosDePago')
        .exec((err, resolucionDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
    
            res.status(201).json({
                ok: true,
                resolucion: resolucionDB
            });
        })
})



module.exports = app;