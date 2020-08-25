const express = require('express');
const fs = require('fs');
const path = require('path');

let app = express();

let Venta = require('../models/venta.model');

let cabeceraXML = require('./constantesXML').cabeceraXML;
let cierreExtensiones = require('./constantesXML').cierreExtensiones;
let cbcUBLVersionID = require('./constantesXML').cbcUBLVersionID;
let cbcProfileID = require('./constantesXML').cbcProfileID;
let cierreFactura = require('./constantesXML').cierreFactura;

const constantesXML = require('./constantesXML');

const NUMERACION_PREFIJO = 'PRUE';
const NUMERACION_DESDE = 98000000;
const NUMERACION_HASTA = 99000000;


function toHex(num) {
    const hex = num.toString(16);
    const longitud = hex.length;
    console.log({ longitud });

    if (longitud > 10) {
        return;
    }

    if (longitud === 10) {
        return hex;
    } else {
        var ceros = "";
        var cantidad_ceros = 10 - longitud;
        for (let i = 0; i < cantidad_ceros; i++) {
            ceros += "0";
        }
        var valorReal = ceros + hex;
        return valorReal;
    }

    return hex;
}


app.get('/ventas', (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Venta
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

            Venta.countDocuments({}, (err, conteo) => {
                res.json({
                    ok: true,
                    ventas,
                    total: conteo
                });
            })

        })
});

app.get('/ventas-lista-completa', (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Venta
        .find()
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

app.post('/ventas', (req, res) => {

    const venta = new Venta(req.body);




    Venta.countDocuments({}, (err, count) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: 'No se pueden contar los registros'
            })
        }

        let numeroDeFactura = NUMERACION_DESDE + count + 1;

        if (numeroDeFactura > NUMERACION_HASTA) {
            console.log('ENTRO AL IF');

            return res.status(500).json({
                ok: false,
                err: 'No se puede generar mas facturas con esta numeración'
            })
        }

        venta.numeroDeFactura = NUMERACION_PREFIJO + numeroDeFactura;
        console.log(venta);

        venta.save((err, ventaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.status(201).json({
                ok: true,
                venta: ventaDB
            });
        })
    })

});

app.get('/ventas/:id', (req, res) => {
    Venta
        .findById(req.params.id)
        .populate('clienteId', 'nombre')
        .populate('productos.productoId')
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

app.get('/ventas/crearXML/:id', (req, res) => {
    Venta
        .findById(req.params.id)
        .populate({ path: 'clienteId' })
        .populate({
            path: 'productos.productoId',
            select: 'nombre'
        })
        .exec((err, venta) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            console.log({ venta });


            const CONSECUTIVO = toHex(Number(venta.numeroDeFactura.split("PRUE")[1]));


            // console.log({ CONSECUTIVO });


            const NIT = '0012107199';
            const nombreDeArchivo = 'face_f' + NIT + CONSECUTIVO + '.xml';
            console.log({ nombreDeArchivo });

            const valorPath = path.resolve(__dirname, '../XML', nombreDeArchivo);

            // console.log({ nombreDeArchivo });


            const primeraExtension = constantesXML.primeraExtension;
            const extensionFirma = constantesXML.extensionFirma;

            const cufe = constantesXML.cbcUUID(
                venta.numeroDeFactura,
                venta.fechaDeFactura,
                venta.subtotal,
                venta.total,
                venta.iva,
                venta.clienteId
            );
            // console.log({ fechaMongo: venta.fechaDeFactura });
            // console.log({ fechaCufe });

            const cbcID = constantesXML.cbcID(venta.numeroDeFactura);
            const cbcIssueDate = constantesXML.cbcIssueDate(venta.fechaDeFactura);
            const cbcIssueTime = constantesXML.cbcIssueTime(venta.fechaDeFactura);

            const tipoDefacturaMoneda = constantesXML.tipoDefacturaMoneda;
            const infoEmpresa = constantesXML.infoEmpresa;

            const infoCliente = constantesXML.infoCliente(venta.clienteId);



            const xmlData = cabeceraXML +
                primeraExtension +
                extensionFirma +
                cierreExtensiones +
                cbcUBLVersionID +
                cbcProfileID +
                cbcID +
                cufe +
                cbcIssueDate +
                cbcIssueTime +
                tipoDefacturaMoneda +
                infoEmpresa +
                infoCliente +
                cierreFactura;

            fs.writeFile(valorPath, xmlData, (err) => {
                if (err) console.log('Error escribiendo el XML');
            })


            res.json({
                ok: true,
                venta,


            })

        })
})

module.exports = app;