const path = require('path');
const express = require('express');

let app = express();

let Producto = require('../models/producto.model');
let Categoria = require('../models/categoria.model');



app.get('/productos', (req, res) => {
    console.log('Ordenada');
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto
        .find()
        .select('nombre etiqueta caracteristicas.modelo caracteristicas.referencia')
        .sort([
            ['nombre', 1]
        ])
        .skip(desde)
        .limit(12)
        // .populate('parent', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({}, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    total: conteo
                });
            })

        })

});


app.get('/producto-por-codigo-de-barra/:ean', (req, res) => {
    console.log({ codigo: req.params.ean })
    Producto
        .findOne()
        .or([
            {
                'caracteristicas.ean13': req.params.ean
            },
            {
                'caracteristicas.ean14': req.params.ean
            }
        ])
        .select('nombre etiqueta caracteristicas.modelo caracteristicas.referencia')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

                res.json({
                    ok: true,
                    producto,
                });

        })
})


app.get('/productos-por-etiqueta-y-termino/:etiqueta/:termino', (req, res) => {

    console.log('productos-por-etiqueta-y-termino', req.params.termino);
    

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'gi');


    Producto.find({ nombre: regex, etiqueta: req.params.etiqueta })
        .select('nombre etiqueta caracteristicas.modelo caracteristicas.referencia')
        .sort([
            ['nombre', 1]
        ])
        .skip(desde)
        .limit(12)
        // .populate('parent', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({}, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    total: conteo
                });
            })

        })

});


app.get('/productos-por-modelo', (req, res) => {
    let modelo = req.query.modelo;

    console.log({modelo});
    

    Producto
        .find({
            'caracteristicas.modelo': modelo
        })
        .select({
            nombre: 1,
            'caracteristicas.modelo': 1,
            'caracteristicas.referencia': 1
        })
        .sort({
            nombre: 1
        })
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });


        })
})


app.get('/productos-por-marca-y-etiqueta', (req, res) => {

    let marca = req.query.marca;
    let etiqueta = req.query.etiqueta;

    console.log({ marca, etiqueta });


    Producto
        .find({
            marca, etiqueta
        })
        .sort([
            ['nombre', 1]
        ])
        .populate({
            path: 'categoria',
            select: 'nombre'
        })
        .populate({
            path: 'marca',
            select: 'nombre'
        })
        .populate({
            path: 'categoria_padre',
            select: 'nombre'
        })
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });


        })

});


app.get('/productos-filtrados', (req, res) => {

    let marca = req.query.marca;
    let categoria1 = req.query.categoria1 === 'undefined' ? undefined : req.query.categoria1;
    let categoria2 = req.query.categoria2 === 'undefined' ? undefined : req.query.categoria2;
    let categoria3 = req.query.categoria3 === 'undefined' ? undefined : req.query.categoria3;
    let categoria4 = req.query.categoria4 === 'undefined' ? undefined : req.query.categoria4;

    // console.log({
    //     marca, categoria1, categoria2, categoria3, categoria4
    // });


    Categoria
        .find()
        .select('nombre parent')
        // .sort({ nombre: 1 })
        .exec((err, categorias) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            const a = JSON.stringify(categorias);
            const data = JSON.parse(a);
            const indexed_nodes = {};
            const tree_roots = [];

            for (let k = 0; k < data.length; k += 1) {
                data[k].children = [];
            }

            for (let i = 0; i < data.length; i += 1) {
                indexed_nodes[data[i]._id] = data[i];
            }

            for (let j = 0; j < data.length; j += 1) {
                const parent = data[j].parent;

                if (parent === undefined) {
                    tree_roots.push(data[j]);
                } else {
                    if (!indexed_nodes[parent]) {

                    } else {
                        indexed_nodes[parent].children.push(data[j]);
                    }
                }
            }

            let CATEGORIAS = tree_roots;
            let ARRAY_CATEGORIAS = [];




            if (categoria4) {
                ARRAY_CATEGORIAS = [categoria4];
            }

            if (!categoria4 && categoria3) {
                const CATEGORIA3 = data.find(element => element._id === categoria3)
                // console.log({ CATEGORIA3 });

                if (CATEGORIA3.nombre === 'Repuestos y Accesorios') {
                    ARRAY_CATEGORIAS = [CATEGORIA3._id];
                    CATEGORIA3.children.forEach(element => ARRAY_CATEGORIAS.push(element._id))
                } else {
                    ARRAY_CATEGORIAS = [categoria3];
                }
            }

            if (!categoria4 && !categoria3 && categoria2) {
                const CATEGORIA2 = data.find(element => element._id === categoria2)
                // console.log({ CATEGORIA2 });

                ARRAY_CATEGORIAS = [CATEGORIA2._id];

                if (CATEGORIA2.children.length > 0) {
                    CATEGORIA2.children.forEach(element => {
                        if (element.nombre !== 'Repuestos y Accesorios') {
                            ARRAY_CATEGORIAS.push(element._id)
                        }
                    })
                }
            }

            if (!categoria4 && !categoria3 && !categoria2 && categoria1) {
                const CATEGORIA1 = data.find(element => element._id === categoria1)
                // console.log({ CATEGORIA1 });

                ARRAY_CATEGORIAS = [CATEGORIA1._id];

                if (CATEGORIA1.children.length > 0) {

                    CATEGORIA1.children.forEach(element => {
                        ARRAY_CATEGORIAS.push(element._id);
                        element.children.forEach(element2 => {
                            if (element2.nombre !== 'Repuestos y Accesorios') {
                                ARRAY_CATEGORIAS.push(element2._id)
                            }
                        })
                    })
                }
            }

            let query;

            if (marca !== 'undefined') {
                query = Producto.find({ marca })
            } else {
                query = Producto.find()
            }

            query
                .where('categoria').in(ARRAY_CATEGORIAS)
                .where('etiqueta').in(['Producto', 'Repuesto'])
                .populate({
                    path: 'categoria',
                    select: 'nombre'
                })
                .populate({
                    path: 'marca',
                    select: 'nombre'
                })
                .populate({
                    path: 'cmmf.proveedor',
                    select: 'primerNombre'
                })
                .exec((err, productos) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    }

                    return res.json({
                        ok: true,
                        productos
                    });


                })
        })




})

const fs = require('fs');
// const path = require('path');


app.get('/siigo', (req, res) => {

    let marca = req.query.marca;
    let categoria1 = req.query.categoria1 === 'undefined' ? undefined : req.query.categoria1;
    let categoria2 = req.query.categoria2 === 'undefined' ? undefined : req.query.categoria2;
    let categoria3 = req.query.categoria3 === 'undefined' ? undefined : req.query.categoria3;
    let categoria4 = req.query.categoria4 === 'undefined' ? undefined : req.query.categoria4;

    // console.log({
    //     marca, categoria1, categoria2, categoria3, categoria4
    // });


    Categoria
        .find()
        .select('nombre parent')
        // .sort({ nombre: 1 })
        .exec((err, categorias) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            const a = JSON.stringify(categorias);
            const data = JSON.parse(a);
            const indexed_nodes = {};
            const tree_roots = [];

            for (let k = 0; k < data.length; k += 1) {
                data[k].children = [];
            }

            for (let i = 0; i < data.length; i += 1) {
                indexed_nodes[data[i]._id] = data[i];
            }

            for (let j = 0; j < data.length; j += 1) {
                const parent = data[j].parent;

                if (parent === undefined) {
                    tree_roots.push(data[j]);
                } else {
                    if (!indexed_nodes[parent]) {

                    } else {
                        indexed_nodes[parent].children.push(data[j]);
                    }
                }
            }

            let CATEGORIAS = tree_roots;
            let ARRAY_CATEGORIAS = [];




            if (categoria4) {
                ARRAY_CATEGORIAS = [categoria4];
            }

            if (!categoria4 && categoria3) {
                const CATEGORIA3 = data.find(element => element._id === categoria3)
                // console.log({ CATEGORIA3 });

                if (CATEGORIA3.nombre === 'Repuestos y Accesorios') {
                    ARRAY_CATEGORIAS = [CATEGORIA3._id];
                    CATEGORIA3.children.forEach(element => ARRAY_CATEGORIAS.push(element._id))
                } else {
                    ARRAY_CATEGORIAS = [categoria3];
                }
            }

            if (!categoria4 && !categoria3 && categoria2) {
                const CATEGORIA2 = data.find(element => element._id === categoria2)
                // console.log({ CATEGORIA2 });

                ARRAY_CATEGORIAS = [CATEGORIA2._id];

                if (CATEGORIA2.children.length > 0) {
                    CATEGORIA2.children.forEach(element => {
                        if (element.nombre !== 'Repuestos y Accesorios') {
                            ARRAY_CATEGORIAS.push(element._id)
                        }
                    })
                }
            }

            if (!categoria4 && !categoria3 && !categoria2 && categoria1) {
                const CATEGORIA1 = data.find(element => element._id === categoria1)
                // console.log({ CATEGORIA1 });

                ARRAY_CATEGORIAS = [CATEGORIA1._id];

                if (CATEGORIA1.children.length > 0) {

                    CATEGORIA1.children.forEach(element => {
                        ARRAY_CATEGORIAS.push(element._id);
                        element.children.forEach(element2 => {
                            if (element2.nombre !== 'Repuestos y Accesorios') {
                                ARRAY_CATEGORIAS.push(element2._id)
                            }
                        })
                    })
                }
            }

            let query;

            if (marca !== 'undefined') {
                query = Producto.find({ marca })
            } else {
                query = Producto.find()
            }

            query
                .where('categoria').in(ARRAY_CATEGORIAS)
                .where('etiqueta').in(['Producto', 'Repuesto'])
                .select('marca.nombre caracteristicas.referencia')
                .populate({
                    path: 'marca',
                    select: 'nombre'
                })
                .exec((err, productos) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    }

                    const valorPath = path.resolve(__dirname, '../XML', 'Acc.Jarra Cafet..csv');
                    // let xmlData = 'ID,Nombre\n';
                    let xmlData = '';

                    productos.forEach(element => {
                        let dataProduct = element._id + ',Acc. Jarra Cafet. ' + element.marca.nombre + ' ' + element.caracteristicas.referencia + '\n';
                        xmlData += dataProduct;
                    })



                    fs.writeFile(valorPath, xmlData, (err) => {
                        if (err) console.log('Error escribiendo el XML');
                    })

                    return res.json({
                        ok: true,
                        mensaje: 'Acc. Jarra Cafet. creado'
                    });


                })
        })




})


app.get('/filtrar-por-nombre/:termino', (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');


    Producto.find({ nombre: regex })
        .populate({
            path: 'categoria',
            select: 'nombre'
        })
        .populate({
            path: 'marca',
            select: 'nombre'
        })
        .populate({
            path: 'cmmf.proveedor',
            select: 'primerNombre'
        })
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            return res.json({
                ok: true,
                productos
            });


        })
})

app.get('/productos-por-categoria-y-etiqueta', (req, res) => {

    let marca = req.query.marca;
    let categoria = req.query.categoria;
    let categoria2 = req.query.categoria2;
    let categoria3 = req.query.categoria3;
    let etiqueta = req.query.etiqueta;

    console.log({ marca, etiqueta, categoria, categoria2, categoria3 });

    Categoria
        .find()
        // .where("nombre")
        // .ne('Repuestos y Accesorios')
        .select('nombre parent')
        .sort({ nombre: 1 })
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            const a = JSON.stringify(categorias);
            const data = JSON.parse(a);
            const indexed_nodes = {};
            const tree_roots = [];

            for (let k = 0; k < data.length; k += 1) {
                data[k].children = [];
            }
            for (let i = 0; i < data.length; i += 1) {
                indexed_nodes[data[i]._id] = data[i];
            }
            for (let j = 0; j < data.length; j += 1) {
                const parent = data[j].parent;

                if (parent === undefined) {
                    tree_roots.push(data[j]);
                } else {
                    if (!indexed_nodes[parent]) {

                    } else {
                        indexed_nodes[parent].children.push(data[j]);
                    }
                }
            }

            let CATEGORIAS = tree_roots;
            let ARRAY_CATEGORIAS = [];
            let ARRAY_NOMBRES = [];

            if (!categoria2 && !categoria3) {
                let CATEGORIA_GET = CATEGORIAS.find(element => element._id === categoria)
                // console.log({ CATEGORIAS, CATEGORIA_GET });


                CATEGORIA_GET.children.forEach(element => {
                    if (element.children.length > 0) {
                        element.children.forEach(element2 => {
                            ARRAY_CATEGORIAS.push(element2._id);
                            ARRAY_NOMBRES.push(element2.nombre);
                        })
                    } else {
                        ARRAY_CATEGORIAS.push(element._id)
                        ARRAY_NOMBRES.push(element.nombre)
                    }
                })
            }

            if (categoria2 && !categoria3) {
                let CATEGORIA_GET = CATEGORIAS.find(element => element._id === categoria)
                let CATEGORIA2_GET = CATEGORIA_GET.children.find(element => element._id === categoria2)
                // console.log({ CATEGORIAS, CATEGORIA_GET, CATEGORIA2_GET });

                if (CATEGORIA2_GET.children.length === 0) {
                    ARRAY_CATEGORIAS.push(CATEGORIA2_GET._id);
                    ARRAY_NOMBRES.push(CATEGORIA2_GET.nombre);
                } else {


                    CATEGORIA2_GET.children.forEach(element => {
                        if (element.children.length > 0) {
                            element.children.forEach(element2 => {
                                ARRAY_CATEGORIAS.push(element2._id);
                                ARRAY_NOMBRES.push(element2.nombre);
                            })
                        } else {
                            ARRAY_CATEGORIAS.push(element._id)
                            ARRAY_NOMBRES.push(element.nombre)
                        }
                    })

                }
            }

            if (categoria3) {
                ARRAY_CATEGORIAS.push(categoria3)
            }


            // console.log({ ARRAY_CATEGORIAS, ARRAY_NOMBRES });


            if (marca === 'undefined' || !marca) {
                Producto
                    .find({
                        etiqueta
                    })
                    .where('categoria').in(ARRAY_CATEGORIAS)
                    .sort([
                        ['nombre', 1]
                    ])
                    .populate({
                        path: 'categoria',
                        select: 'nombre'
                    })
                    .populate({
                        path: 'marca',
                        select: 'nombre'
                    })
                    .populate({
                        path: 'categoria_padre',
                        select: 'nombre'
                    })
                    .exec((err, productos) => {
                        if (err) {
                            return res.status(500).json({
                                ok: false,
                                err
                            });
                        }

                        // console.log({productos});


                        res.json({
                            ok: true,
                            productos
                        });


                    })
            } else {
                Producto
                    .find({
                        marca, etiqueta
                    })
                    .where('categoria').in(ARRAY_CATEGORIAS)
                    .sort([
                        ['nombre', 1]
                    ])
                    .populate({
                        path: 'categoria',
                        select: 'nombre'
                    })
                    .populate({
                        path: 'marca',
                        select: 'nombre'
                    })
                    .populate({
                        path: 'categoria_padre',
                        select: 'nombre'
                    })
                    .exec((err, productos) => {
                        if (err) {
                            return res.status(500).json({
                                ok: false,
                                err
                            });
                        }

                        // console.log({productos});


                        res.json({
                            ok: true,
                            productos
                        });


                    })
            }




        })




});


app.get('/productos/productos-por-nombre/:nombre', (req, res) => {

    console.log('Buscando producto por nombre', req.params.nombre)

    var expresion = new RegExp(req.params.nombre, 'gi');

    let desde = req.query.desde || 0;
    let tipo = req.query.tipo || 'Producto';
    desde = Number(desde);

    Producto
        .find({
            nombre: expresion,
            etiqueta: tipo
        }, 'nombre caracteristicas.precio caracteristicas.referencia pictures.pp pictures.small')
        .sort([
            ['nombre', 1]
        ])
        .skip(desde)
        .limit(8)
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({ nombre: expresion, etiqueta: tipo }, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    total: conteo
                });
            })

        })

});

app.get('/productos/productos-por-id/:id', (req, res) => {

    console.log('Petición Qr');
    console.log({ id: req.params.id });


    Producto
        .findById(req.params.id, 'nombre caracteristicas.precio caracteristicas.referencia pictures.pp pictures.small')
        .exec((err, producto) => {
            if (err) {
                console.log({ error: 'Error' });
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!producto) {
                console.log({ error: 'No Producto' });
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No se encuentra un producto con ese Id'
                });
            }

            console.log({ nombre: producto.nombre });

            res.json({
                ok: true,
                producto,
            });
        })

});




app.get('/productos-lista-completa', (req, res) => {

    console.log(`Petición a /productos-lista-completa`);


    Producto
        .find()
        .populate({ path: 'combo', select: 'nombre etiqueta caracteristicas.referencia' })
        .populate({ path: 'cmmf.proveedor', select: 'primerNombre' })
        .populate({ path: 'categoria', select: 'nombre' })
        .populate({ path: 'marca', select: 'nombre' })
        .sort({ nombre: 1 })
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({}, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    total: conteo
                });
            })

        })

});

app.post('/productos', (req, res) => {
    let body = req.body;
    console.log('body');
    console.log(body);
    console.log('body');

    let producto = new Producto({
        etiqueta: body.etiqueta,
        nombre: body.nombre,
        slug: body.slug,
        marca: body.marca,
        categoria: body.categoria,
        categoria_padre: body.categoria_padre,
        caracteristicas: body.caracteristicas,
        detalles: body.detalles,
        pictures: {
            pp: body.pp,
            large: body.pictures || [],
            medium: [],
            small: []
        },
        cmmf: body.cmmf,
        videos: body.videos,
    })

    console.log('producto');
    console.log(producto);
    console.log('producto');

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    })
});

app.put('/productos/:id', (req, res) => {
    console.log('PETICION IMAGENES');
    Producto.findByIdAndUpdate(req.params.id, { pictures: req.body }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    })
})

app.put('/productos-mostrar/:id', (req, res) => {
    console.log('PETICION productos Mostrar');
    Producto.findByIdAndUpdate(req.params.id, { mostrar: req.body.mostrar }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    })
})

app.put('/productos-hermandad/:id', (req, res) => {
    console.log('PETICION productos HErmandad');
    Producto.findByIdAndUpdate(req.params.id, { hermandad: req.body.hermandad }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    })
})

app.put('/productos/add/:id', (req, res) => {
    console.log('PETICION GUARDAR REPUESTOS Y ACCESORIOS');
    Producto.findByIdAndUpdate(req.params.id, { accesorios: req.body.accesorios, repuestos: req.body.repuestos }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    })
})

app.put('/productos/combo/:id', (req, res) => {
    console.log('PETICION Combo');
    Producto.findByIdAndUpdate(req.params.id, { combo: req.body.combo }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    })
})

app.put('/productos/cmmf/:id', (req, res) => {
    console.log('Edicion CMMF');
    Producto.findByIdAndUpdate(req.params.id, { cmmf: req.body.cmmf }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    })
})

app.put('/productos/agregar-descripcion/:id', (req, res) => {
    console.log('Agregar Descripcion', req.params.id);
    console.log(req.body);
    Producto.findByIdAndUpdate(req.params.id, { descripcion: req.body }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    })
})

app.get('/productos/:id', (req, res) => {
    Producto
        .findById(req.params.id)
        .populate('categoria_padre')
        .populate('categoria')
        .populate('hermanos')
        .populate('repuestos')
        .populate('accesorios')
        .populate('combo')
        .populate('marca')
        .populate({
            path: 'hermandad',
            populate: { path: 'productos.producto', select: 'nombre' }
        })
        .populate('hermandad.productos.producto')
        // .populate({ path: 'hermandad.productos.producto', select: 'nombre' })
        .populate({ path: 'cmmf.proveedor', select: 'primerNombre' })
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.status(201).json({
                ok: true,
                producto: productoDB
            });
        })
})

app.get('/historico-productos/:id', (req, res) => {
    Producto
        .findById(req.params.id)
        .select('nombre historico')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.status(201).json({
                ok: true,
                producto: productoDB
            });
        })
})

const ordenado = {
    precioMenor: 'caracteristicas.precio',
    precioMayor: '-caracteristicas.precio',
    ascendente: 'nombre',
    descendente: '-nombre',
}

app.get('/productos/categoria/:categoriaId', (req, res) => {

    const QUERY = req.query;

    const names = Object.keys(QUERY);
    const namesFiltrados = names.filter(name => name.startsWith('DETALLES'))
    const QUERYDETALLES = [];
    namesindetalles = namesFiltrados.map(name => name = name.slice(8))
    namesFiltrados.forEach((name, indice) => {
        QUERYDETALLES.push([namesindetalles[indice], QUERY[name].split(',')])
    })


    const ordenPor = ordenado[req.query.ordenPor] || '-caracteristicas.precio';
    const pagina = +req.query.pagina || 1;
    const productosPorPagina = 12;
    const desde = (pagina - 1) * productosPorPagina;

    console.log(`Productos Ordenados por ${ordenPor}, CategoriaId: ${req.params.categoriaId}`);

    Categoria
        .find()
        .where({ parent: req.params.categoriaId })
        .where('nombre').ne('Repuestos y Accesorios')
        .select('nombre parent')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            let ARRAY_CATEGORIAS = categorias.map(categoria => categoria._id);

            if (ARRAY_CATEGORIAS.length === 0) {
                ARRAY_CATEGORIAS = [req.params.categoriaId];
            }

            let query = Producto
                .find({ etiqueta: 'Producto', mostrar: true });

            // if (QUERYDETALLES.length > 0) {
                console.log({QUERYDETALLES: JSON.stringify(QUERYDETALLES)});
            QUERYDETALLES.forEach(q => {

                query.where('detalles.' + q[0]).in(q[1])
            })
            // }

            // .find({ etiqueta: 'Producto' })
            query
                .where('categoria').in(ARRAY_CATEGORIAS)
                .select('nombre caracteristicas.precio pictures')
                .limit(productosPorPagina)
                .skip(desde)
                .sort(ordenPor)
                .exec((err, productos) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    }

                    let queryConteo = Producto
                        .where({ etiqueta: 'Producto', mostrar: true });
                    QUERYDETALLES.forEach(q => queryConteo.where('detalles.' + q[0]).in(q[1]))

                    queryConteo
                        // .where({ etiqueta: 'Producto' })
                        .where('categoria').in(ARRAY_CATEGORIAS).countDocuments({}, (err, conteo) => {

                            productos.forEach(producto => {
                                if (!producto.pictures || !producto.pictures.medium || producto.pictures.medium.length === 0) {
                                    producto.pictures = false;
                                } else {
                                    producto.pictures = true;
                                }
                            })

                            res.json({
                                ok: true,
                                productos,
                                total: conteo
                            });
                        })


                })

        })


})

app.get('/productos/subcategoria/:subcategoriaId', (req, res) => {



    const ordenPor = ordenado[req.query.ordenPor] || '-caracteristicas.precio';
    const pagina = +req.query.pagina || 1;
    const productosPorPagina = 12;
    const desde = (pagina - 1) * productosPorPagina;

    console.log(`Peticion a subcategoria: ${req.params.subcategoriaId}, Ordenado por ${ordenPor}`);

    Producto
        .find({ etiqueta: 'Producto', categoria: req.params.subcategoriaId })
        .select('nombre caracteristicas.precio pictures')
        .limit(productosPorPagina)
        .skip(desde)
        .sort(ordenPor)
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto
                .countDocuments({ etiqueta: 'Producto', categoria: req.params.subcategoriaId }, (err, conteo) => {

                    productos.forEach(producto => {
                        if (!producto.pictures || !producto.pictures.medium || producto.pictures.medium.length === 0) {
                            producto.pictures = false;
                        } else {
                            producto.pictures = true;
                        }
                    })

                    res.json({
                        ok: true,
                        productos,
                        total: conteo
                    });
                })


        })

})

app.get('/arreglar-precios-productos-aleatoriamente', (req, res) => {
    Producto
        .find({ etiqueta: 'Producto' })
        .exec((err, productos) => {
            if (err) {
                return res.json({ rta: ':(' })
            }

            let i = 0;

            productos.forEach(async producto => {
                let fecha = new Date();
                let milisegundos = fecha.getMilliseconds();
                producto.caracteristicas.precio = milisegundos * 100;
                let producto_arreglado = await producto.save();
                i++;
                console.log(`Producto ${i} Arreglado`);
            })

            res.json({ rta: ':D' })
        })
})

app.get('/productos/marca-subcategoria/:marcaId/:subcategoriaId', (req, res) => {

    const ordenPor = ordenado[req.query.ordenPor] || '-caracteristicas.precio';
    const pagina = +req.query.pagina || 1;
    const productosPorPagina = 12;
    const desde = (pagina - 1) * productosPorPagina;

    Producto
        .find({ etiqueta: 'Producto', categoria: req.params.subcategoriaId, marca: req.params.marcaId, mostrar: true })
        .select('nombre caracteristicas.precio pictures')
        .limit(productosPorPagina)
        .skip(desde)
        .sort(ordenPor)
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto
                .countDocuments({ etiqueta: 'Producto', categoria: req.params.subcategoriaId, marca: req.params.marcaId, mostrar: true }, (err, conteo) => {

                    productos.forEach(producto => {
                        if (!producto.pictures || !producto.pictures.medium || producto.pictures.medium.length === 0) {
                            producto.pictures = false;
                        } else {
                            producto.pictures = true;
                        }
                    })

                    res.json({
                        ok: true,
                        productos,
                        total: conteo
                    });
                })


        })

})




app.get('/productos/marca-categoria/:marcaId/:categoriaId', (req, res) => {

    const ordenPor = ordenado[req.query.ordenPor] || '-caracteristicas.precio';
    const pagina = +req.query.pagina || 1;
    const productosPorPagina = 12;
    const desde = (pagina - 1) * productosPorPagina;

    Categoria
        .find()
        .where({ parent: req.params.categoriaId })
        .where('nombre').ne('Repuestos y Accesorios')
        .select('nombre parent')
        .sort({ nombre: 1 })
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            let ARRAY_CATEGORIAS = categorias.map(categoria => categoria._id);

            if (ARRAY_CATEGORIAS.length === 0) {
                ARRAY_CATEGORIAS = [req.params.categoriaId];
            }

            Producto
                .find({ marca: req.params.marcaId, etiqueta: 'Producto' })
                .where('categoria').in(ARRAY_CATEGORIAS)
                .select('nombre caracteristicas.precio pictures')
                .limit(productosPorPagina)
                .skip(desde)
                .sort(ordenPor)
                .exec((err, productos) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    }

                    Producto
                        .where({ marca: req.params.marcaId, etiqueta: 'Producto' }).where('categoria').in(ARRAY_CATEGORIAS).countDocuments({}, (err, conteo) => {


                            productos.forEach(producto => {
                                if (!producto.pictures || !producto.pictures.medium || producto.pictures.medium.length === 0) {
                                    producto.pictures = false;
                                } else {
                                    producto.pictures = true;
                                }
                            })


                            res.json({
                                ok: true,
                                productos,
                                total: conteo
                            });
                        })


                })

        })


})

app.get('/productos/marca/:marcaId', (req, res) => {

    const ordenPor = ordenado[req.query.ordenPor] || '-caracteristicas.precio';
    const pagina = +req.query.pagina || 1;
    const productosPorPagina = 12;
    const desde = (pagina - 1) * productosPorPagina;
    console.log(`Marca con Id ${req.params.marcaId}, pagina ${pagina}`);

    Producto
        .find({
            marca: req.params.marcaId,
            etiqueta: 'Producto'
        })
        .select('nombre caracteristicas.precio pictures')
        .limit(productosPorPagina)
        .skip(desde)
        .sort(ordenPor)
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({
                marca: req.params.marcaId,
                etiqueta: 'Producto'
            }, (err, conteo) => {

                productos.forEach(producto => {
                    if (!producto.pictures || !producto.pictures.medium || producto.pictures.medium.length === 0) {
                        producto.pictures = false;
                    } else {
                        producto.pictures = true;
                    }
                })

                res.json({
                    ok: true,
                    productos,
                    total: conteo
                });
            })


        })
})

app.get('/productos/referencia/:ref', (req, res) => {
    console.log({ referencia: req.params.ref });

    Producto
        .find({
            'caracteristicas.referencia': req.params.ref
        }, 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });

        })
})

app.get('/productos/por-referencia/:ref', (req, res) => {
    console.log({ referencia: req.params.ref });

    Producto
        .findOne({
            'caracteristicas.referencia': req.params.ref
        }, 'nombre')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!producto) {
                return res.json({
                    ok: false,
                    err: 'No se encontró un producto con la referencia ' + req.params.ref
                });
            }

            res.json({
                ok: true,
                producto
            });

        })
})

app.get('/poner-hermanos', (req, res) => {
    Producto
        .find()
        .exec((err, productos) => {
            productos.forEach(element => {
                element.hermanos = [];
                // Guardar
                Producto
                    .findByIdAndUpdate(element._id, element, (err, cat) => {
                        console.log('CATid', cat.hermanos);
                    })
            })
            res.status(201).json({
                ok: true,
                productos: productos
            });
        })
})


app.put('/editar-hermanos/:id', (req, res) => {
    console.log('HERMANOS', req.params.id);
    console.log('BODY', req.body);

    Producto.findByIdAndUpdate(req.params.id, req.body, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    })
})

app.put('/editar-detalles/:id', (req, res) => {
    console.log('ID', req.params.id);
    console.log('BODY', req.body);

    Producto.findByIdAndUpdate(req.params.id, { detalles: req.body }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    })
})

app.put('/editar-caracteristicas/:id', (req, res) => {
    console.log('ID', req.params.id);
    console.log('BODY', req.body);

    Producto.findByIdAndUpdate(req.params.id, { caracteristicas: req.body }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    })
})

app.put('/editar-nombre/:id', (req, res) => {
    console.log('ID', req.params.id);
    console.log('BODY', req.body);

    Producto.findByIdAndUpdate(req.params.id, { nombre: req.body.nombre, slug: req.body.slug }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    })
})

app.put('/editar-marca/:id', (req, res) => {
    console.log('EDITAR MARCA');
    console.log('ID', req.params.id);
    console.log('BODY', req.body);

    Producto.findByIdAndUpdate(req.params.id, { marca: req.body.marca }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    })
})

app.put('/editar-etiqueta/:id', (req, res) => {
    console.log('EDITAR ETIQUETA');
    console.log('ID', req.params.id);
    console.log('BODY', req.body);

    Producto.findByIdAndUpdate(req.params.id, { etiqueta: req.body.etiqueta }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    })
})

app.put('/editar-categoria/:id', (req, res) => {
    console.log('EDITAR CATEGORIA');
    console.log('ID', req.params.id);
    console.log('BODY', req.body);

    Producto.findByIdAndUpdate(req.params.id, { categoria: req.body.categoria }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    })
})

app.get('/arreglar-los-productos', (req, res) => {
    Producto
        .find({})
        .select('nombre')
        .populate({ path: 'categoria', select: 'nombre' })
        .populate({ path: 'categoria_padre', select: 'nombre' })
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            productos.forEach(element => {

                if (!element.categoria_padre) {
                    console.log('Sin Categoria Padre');

                } else {

                    if (element.categoria_padre.nombre === 'Repuestos y Accesorios') {
                        Producto
                            .findByIdAndUpdate(element._id, { tipo: 'Repuesto' }, (err, cat) => {
                                console.log('Repuesto');
                            })
                    } else {
                        Producto
                            .findByIdAndUpdate(element._id, { tipo: 'Producto' }, (err, cat) => {
                                console.log('Producto');
                            })
                    }
                }

            })

            res.status(201).json({
                ok: true,
                productos: productos
            });
        })
})

app.get('/arreglar-productos', (req, res) => {
    Producto
        .find({}, 'nombre categoria categoria_padre')
        .populate({ path: 'categoria', select: 'parent' })
        .sort('nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            productos.forEach((element, index) => {
                if (element.categoria.parent) {
                    Producto.findByIdAndUpdate(element._id, { categoria_padre: element.categoria.parent }, (err, prod) => {
                        console.log(`Producto ${index}`);
                    })
                }
            });


            res.json({
                ok: true,
                productos: productos,
                total: productos.length
            });

        })
})


app.get('/arreglar-los-productos-etiqueta', (req, res) => {
    Producto
        .find({})
        .select('nombre tipo')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            productos.forEach(element => {


                Producto
                    .findByIdAndUpdate(element._id, { etiqueta: element.tipo }, (err, cat) => {
                        console.log('Arreglado');
                    })

            })

            res.status(201).json({
                ok: true,
                productos: productos
            });
        })
})

app.get('/arreglar-los-productos-tipo', (req, res) => {
    Producto
        .find({})
        .select('nombre tipo')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            productos.forEach(element => {


                Producto
                    .findByIdAndUpdate(element._id, { tipo: '' }, (err, cat) => {
                        console.log('Arreglado');
                    })

            })

            res.status(201).json({
                ok: true,
                productos: productos
            });
        })
})

const download = require('image-downloader')
// var path = require('path');

app.get('/descargar-imagenes', (req, res) => {

    Producto
        .find({})
        .skip(3200)
        .limit(1)
        .select('pictures')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            // console.log(__dirname);


            productos.forEach((producto, index) => {
                console.log(index);

                if (producto.pictures && producto.pictures.large && producto.pictures.large.length > 0) {
                    const options = {
                        url: producto.pictures.large[producto.pictures.pp - 1],
                        dest: __dirname + '/public/' + producto._id + '.png'
                    }

                    setTimeout(() => {
                        download.image(options)
                            .then(({ filename, image }) => {
                                console.log('File saved to', filename)
                            })
                            .catch((err) => {
                                console.error(err)
                            })
                    }, 5000)


                }

            })

            res.status(201).json({
                ok: true,
                // productos: productos
            });
        })

})

app.get('/descargar-imagen/:id', (req, res) => {

    Producto
        .findOne({ _id: req.params.id })
        .select('pictures')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }


            if (producto.pictures && producto.pictures.large && producto.pictures.large.length > 0) {
                const masExtension = producto._id + '.png';
                const options = {
                    url: producto.pictures.large[producto.pictures.pp - 1],
                    dest: path.join(__dirname, '../public/images', masExtension)
                }

                download.image(options)
                    .then(({ filename, image }) => {
                        console.log('File saved to', filename)
                    })
                    .catch((err) => {
                        console.error(err)
                    })



            }


            res.status(201).json({
                ok: true
            });
        })

})

let Compra = require('../models/compra.model');

app.get('/productos-banderas', (req, res) => {
    console.log('Productos Banderas');
    
    Producto
        // .find({ mostrar: false })
        .find()
        .select('_id')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            let producto_index = 0;

            productos.forEach(async producto => {


                const compra = await Compra.find()
                    .or([{
                        'products.productId': producto._id
                    }, {
                        'products.productos.productId': producto._id
                    }])
                    .select('_id');



                if (compra.length > 0) {
                    producto.mostrar = true;
                    producto.comprado = true;
                    let producto_arreglado = await producto.save();
                    console.log('Producto :P ' + producto_index);

                } else {
                    producto.mostrar = false;
                    producto.comprado = false;
                    let producto_arreglado = await producto.save();

                    console.log('Producto :C ' + producto_index);
                }

                producto_index++;

            })
            return res.status(200).json({
                ok: true,
                mensaje: 'OK'
            });
        })
})

app.get('/descargar-imagenes-2', (req, res) => {

    Producto
        .find()
        .select('pictures')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            // console.log(__dirname);

            // console.log(path.join(__dirname, '..', 'public'))

            // const url = productos[0]._id + '.png';

            // console.log(path.join(__dirname, '..', 'public', 'images', url));


            // if (fs.existsSync(path.join(__dirname, '..', 'public', 'images', url))) {
            //     console.log('The file exists.');
            //   }



            productos.forEach(async (producto, index) => {

                const url = producto._id + '.png';

                if (
                    producto.pictures &&
                    producto.pictures.large &&
                    producto.pictures.large.length > 0 &&
                    !fs.existsSync(path.join(__dirname, '..', 'public', 'images', url))
                ) {


                    // **********************************
                    // if (producto.pictures && producto.pictures.large && producto.pictures.large.length > 0) {
                    //     const masExtension = producto._id + '.png';
                    //     const options = {
                    //         url: producto.pictures.large[producto.pictures.pp - 1],
                    //         dest: path.join(__dirname, '../public/images', masExtension)
                    //     }
        
                    //     download.image(options)
                    //         .then(({ filename, image }) => {
                    //             console.log('File saved to', filename)
                    //         })
                    //         .catch((err) => {
                    //             console.error(err)
                    //         })
        
        
        
                    // }
                    // ***********************************

                    // const options = {
                    //     url: producto.pictures.large[producto.pictures.pp - 1],
                    //     dest: __dirname + '/public/' + producto._id + '.png'
                    // }

                    const masExtension = producto._id + '.png';
                        const options = {
                            url: producto.pictures.large[producto.pictures.pp - 1],
                            dest: path.join(__dirname, '../public/images', masExtension)
                        }

                    try {
                        const img = await download.image(options);
                        console.log(index);

                    } catch (err) {
                        console.log({
                            id_del_producto: producto._id,
                            url_del_producto: options.url
                        });
                    }

                }

            })

            res.status(201).json({
                ok: true,
                productos: 'ok'
            });
        })

})

app.get('/poner-impuesto', (req, res) => {

    Producto
        .find()
        .select('nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            productos.forEach(async (producto, index) => {

                try {
                    
                    await Producto.findByIdAndUpdate( producto._id , { impuesto: '5db63d12886fdd3828f3743f'})
                    console.log(index + '---' + producto.nombre)
                } catch (error) {
                    console.log('ERROR' + index + '---' + producto.nombre)
                }

            })

            res.status(201).json({
                ok: true,
                productos: 'ok'
            });
        })

})

module.exports = app;