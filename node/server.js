require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');

const app = express();


const cors = require('cors')
 
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use(cors({origin: [
//     "http://localhost:8100",
//     "http://192.168.0.104:8100"
//   ], credentials: true}))




//   var originsWhitelist = [
//     "http://localhost:8100",
//     "http://192.168.0.104:8100"
//   ];
//   var corsOptions = {
//     origin: function(origin, callback){
//           var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
//           callback(null, isWhitelisted);
//     },
//     credentials:true
//   }
//   //here is the magic
//   app.use(cors(corsOptions));



// CORS
// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
//     next();
// });



app.use(cors());

app.use(express.static('public'))

// app.use(session({
//     secret: 'mysecretsession',
//     resave: false,
//     saveUninitialized: false
// }));

require('./config/passport-local-auth');
app.use(passport.initialize());
// app.use(passport.session());

app.use(require('./routes/index.routes'));

const path = require('path')

app.get('/iniciar-base-de-datos', (req, res1) => {
    mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, res) => {
        if (err) {
            console.log('ERROR EN LA CONEXIÓN A LA BASE DE DATOS');
            return res1.status(500).json({
                ok: false,
                err
            });
        };
        console.log(`Base de Datos: ${process.env.URLDB}`)
        return res1.status(200).json({
            ok: true
        });
    });
});

// default
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, res) => {
    if (err) {
        console.log('ERROR EN LA CONEXIÓN A LA BASE DE DATOS');
        return;
    };
    console.log(`Base de Datos: ${process.env.URLDB}`)
    return;
});

// app.listen(process.env.PORT, '192.168.0.15', () => {
//     console.log(`Escuchando en el puerto: ${process.env.PORT}`);
// })

// app.listen(process.env.PORT, () => {
//     console.log(`Escuchando en el puerto: ${process.env.PORT}`);
// })

const server = app.listen(process.env.PORT, () => {
    console.log(`Escuchando en el puerto: ${process.env.PORT}`);
});
const io = require('socket.io').listen(server);

app.set('io', io);