const express = require('express');
const Usuario = require('../models/usuario.model');

let app = express();

const passport = require('passport');

const passportConfig = require('../config/passport-local-auth');

const jwt = require('jsonwebtoken');

app.post('/signup-local', (req, res, next) => {
    let body = req.body;
    const nuevoUsuario = new Usuario({
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
        tipo: body.tipo,
        password: body.password
    });

    Usuario.findOne({ numeroId: req.body.numeroId }, (err, usuarioExistente) => {
        if (usuarioExistente) {
            return res.status(400).send('Ya este numeroId está registrado');
        }
        nuevoUsuario.save((err) => {
            if (err) {
                next(err);
            }
            req.logIn(nuevoUsuario, (err) => {
                if (err) {
                    next(err);
                }
                res.send('Usuario creado exitosamente')    
            })
        })
    })
});

app.post('/signin-local', (req, res, next) => {
    console.log('Post Login');
    
    passport.authenticate('local', { session: false }, (err, user, info) => {
        console.log('Passport Authenticate');
        // return res.json({test: 'TEST'})
        
        if (err || !user) {
            return res.status(400).json({
                message: info.message,
                token: info.token,
                success: info.success
            });
        }
        req.login(user, { session: false }, (err) => {
            if (err) { next(err) }
            idUser = user.id;
            const token = jwt.sign({ idUser, numeroId: user.numeroId }, 'SECRETO');
            return res.json({
                message: 'valid credentials',
                success: true,
                token: token
            });
        });
    })(req, res, next);
});

app.get('/logout-local', passportConfig.estaAutenticado, (req, res, next) => {
    req.logout();
    res.send('Logout Exitoso');
});

app.get('/usuarioInfo-local', passportConfig.estaAutenticado, (req, res) => {
    res.json(req.user);
});

module.exports = app;