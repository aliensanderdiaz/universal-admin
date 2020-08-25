const express = require('express');

let app = express();

let Hermandad = require('../models/hermandad.model');

app.get('/hermandad', (req, res) => {
    Hermandad
        .find()
        .populate({
            path: 'productos.producto',
            select: 'nombre'
        })
        .exec(
            (err, hermandades) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    hermandades
                });
            })

})

app.get('/hermandad/:id', (req, res) => {
    Hermandad
        .findOne({_id: req.params.id})
        .populate({
            path: 'productos.producto',
            select: 'nombre'
        })
        .exec(
            (err, hermandad) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    hermandad
                });
            })

})

app.put('/hermandad/:id', (req, res) => {
    Hermandad
        .findOneAndUpdate({_id: req.params.id}, {productos: req.body.productos})
        .exec(
            (err, hermandad) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    hermandad
                });
            })

})

app.post('/hermandad', (req, res) => {
    let body = req.body;

    let hermandad = new Hermandad({
        nombre: body.nombre,
        propiedades: body.propiedades
    })

    hermandad.save((err, hermandadDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            hermandad: hermandadDB
        });
    })
})

module.exports = app;