const express = require('express');

let app = express();

let Usuario = require('../models/usuario.model');

app.post('/usuarios', (req, res) => {
    let body = req.body;

    console.log(body);

    let usuario = new Usuario({
        razonSocial: body.razonSocial,
        nombreComercial: body.nombreComercial,
        primerNombre: body.primerNombre,
        segundoNombre: body.segundoNombre,
        apellidos: body.apellidos,
        tipoId: body.tipoId,
        numeroId: body.numeroId,
        ciudad: body.ciudad,
        departamento: body.departamento,
        direccion: body.direccion,
        telefono: body.telefono,
        email: body.email,
        tipo: body.tipo
    })

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioDB
        });
    })
});

// app.get('/crear-muchos-usuarios', (req, res) => {
//     const USUARIOS = [

//     ];

//     USUARIOS.forEach(element => {
//         let usuario = new Usuario({
//             razonSocial: element[1].trim(),
//             // nombreComercial: body.nombreComercial,
//             // primerNombre: element[1],
//             // segundoNombre: '',
//             // apellidos: element[1],
//             tipoId: 'cc',
//             numeroId: element[0],
//             ciudad: element[2],
//             departamento: 'Huila',
//             direccion: element[4],
//             telefono: element[3],
//             // email: body.email,
//             tipo: 'cliente'
//         })

//         usuario.save((err, usuarioDB) => {
//             if (err) {
//                 console.log('Error', element[0]);
//             }

//             console.log('Hecho');


//         })
//     })

//     res.status(201).json({
//         ok: true
//     });
// })

app.get('/usuarios', (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario
        .find()
        .sort({ nombre: 1 })
        .skip(desde)
        .limit(8)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Usuario.countDocuments({}, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    total: conteo
                });
            })

        })
});

app.get('/usuarios/usuario-por-numero/:numero', (req, res) => {
    let numero = req.params.numero;

    console.log({ 'Numero de Identificación': numero });


    Usuario
        .findOne({ numeroId: numero })
        .exec((err, usuario) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: `No existe un usuario con este número ${numero} (CC ó NIT)`
                });
            }


            res.json({
                ok: true,
                usuario
            });


        })
});

app.get('/usuarios-por-tipo-lista-completa', (req, res) => {
    console.log('Se cargaron todos los usuarios...');
    let tipo = req.query.tipo || 0;

    Usuario
        .find({ tipo: tipo })
        .sort({ nombre: 1 })
        // .skip(desde)
        // .limit(8)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            // Usuario.countDocuments({}, (err, conteo) => {
            res.json({
                ok: true,
                usuarios,
                // total: conteo
            });
            // })

        })
});

app.get('/clientes', (req, res) => {
    console.log('Se cargaron todos los clientes...');
    let tipoId = req.query.tipoId || 'cc';

    Usuario
        .find({ tipo: 'cliente', tipoId: tipoId })
        .sort({ numeroId: 1 })
        .exec((err, usuarios) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            // Usuario.countDocuments({}, (err, conteo) => {
            res.json({
                ok: true,
                usuarios,
                // total: conteo
            });
            // })

        })
});

app.get('/usuarios-lista-completa', (req, res) => {

    Usuario
        .find()
        .exec((err, usuarios) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }


            res.json({
                ok: true,
                usuarios
            });

        })
});

app.put('/usuarios/:id', (req, res) => {
    console.log('Editando', req.params.id, req.body.apellidos);
    
    Usuario
        .findByIdAndUpdate(req.params.id, req.body)
        .exec((err, usuario) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }


            res.json({
                ok: true,
                usuario
            });

        })
})

module.exports = app;