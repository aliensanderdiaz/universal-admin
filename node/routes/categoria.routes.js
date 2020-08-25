const express = require('express');

let app = express();

let Categoria = require('../models/categoria.model');

app.get('/categorias-paginadas', (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Categoria
        .find({}, 'nombre parent')
        .skip(desde)
        .limit(8)
        .sort({ nombre: 1 })
        .populate('parent', 'nombre')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Categoria.countDocuments({}, (err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    total: conteo
                });
            })

        })

});

// app.get('/categorias-lista-completa', (req, res) => {

//     Categoria
//         .find({}, 'nombre parent')
//         // .populate('parent', 'nombre')
//         .sort({ nombre: 1 })
//         .exec((err, categorias) => {
//             if (err) {
//                 return res.status(500).json({
//                     ok: false,
//                     err
//                 });
//             }

//             Categoria.countDocuments({}, (err, conteo) => {
//                 res.json({
//                     ok: true,
//                     categorias,
//                     total: conteo
//                 });
//             })

//         })

// });

const slugify = function(palabra) {
    const chars = {
      "á":"a", "é":"e", "í":"i", "ó":"o", "ú":"u", "ñ":"n"
    };

    const palabraSlugify = palabra
                          .trim()
                          .toLowerCase()
                          .replace(/\s+/g, '-')
                          .replace(/[áéíóúñ]/g, e => chars[e])

    return palabraSlugify;
  }

  app.get('/arreglar-slug-categorias', (req, res) => {
      Categoria
        .find()
        .select('nombre')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            categorias.forEach(
                categoria => {
                    Categoria.findByIdAndUpdate(
                        categoria._id, { slug: slugify(categoria.nombre)}, { new: true },
                        (err, doc) => {
                            if (err) console.log('ERROR')
                            console.log(doc.slug);
                        }
                    )
                }
            )

            res.json({
                ok: true,
                categorias,
            });

        })
  })

app.get('/categorias-lista-completa', (req, res) => {

    Categoria
        .find({}, 'nombre parent')
        // .populate('parent', 'nombre')
        .populate({
            path: 'parent',
            select: 'nombre parent',
            populate: {
                path: 'parent',
                select: 'nombre',
                populate: {
                    path: 'parent',
                    select: 'nombre'
                }
            }
        })
        .sort({ nombre: 1 })
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            // Categoria.countDocuments({}, (err, conteo) => {
            res.json({
                ok: true,
                categorias,
                // total: conteo
            });
            // })

        })

});

app.get('/categorias-lista-completa-crear-arbol', (req, res) => {

    Categoria
        .find({}, 'nombre parent')
        .sort({ nombre: 1 })
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            // Categoria.countDocuments({}, (err, conteo) => {
            res.json({
                ok: true,
                categorias,
                // total: conteo
            });
            // })

        })

});


app.get('/crear-arbol', (req, res) => {

    Categoria
        .find({}, 'nombre parent')
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
                // console.log(parent);
                if (parent === undefined) {
                    tree_roots.push(data[j]);
                } else {
                    indexed_nodes[parent].children.push(data[j]);
                }
            }
            // console.log(JSON.stringify(tree_roots, undefined, '\t'));


            res.json({
                ok: true,
                categorias: tree_roots
            });


        })

});

app.get('/crear-arbol-sin-rya', (req, res) => {

    Categoria
        .find()
        .where("nombre").ne('Repuestos y Accesorios')
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
            const indexed_nodes = {},
                tree_roots = [];
            for (let k = 0; k < data.length; k += 1) {
                data[k].children = [];
            }
            for (let i = 0; i < data.length; i += 1) {
                indexed_nodes[data[i]._id] = data[i];
            }
            for (let j = 0; j < data.length; j += 1) {
                const parent = data[j].parent;
                // console.log(parent);
                if (parent === undefined) {
                    tree_roots.push(data[j]);
                } else {
                    if (!indexed_nodes[parent]) {

                    } else {
                        indexed_nodes[parent].children.push(data[j]);
                    }
                }
            }
            // console.log(JSON.stringify(tree_roots, undefined, '\t'));


            res.json({
                ok: true,
                categorias: tree_roots
            });


        })

});

app.get('/categorias-hijas/:categoriaId', (req, res) => {
    Categoria
        .find()
        .where({ parent: req.params.categoriaId })
        .where("nombre").ne('Repuestos y Accesorios')
        .select('nombre parent')
        .sort({ nombre: 1 })
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            const ARRAY_CATEGORIAS = categorias.map(categoria => categoria._id);

            res.json({
                ok: true,
                categorias: ARRAY_CATEGORIAS
            });
        })
})

app.get('/crear-arbol-2', (req, res) => {

    Categoria
        .find({}, 'nombre parent detalles')
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
            const indexed_nodes = {},
                tree_roots = [];
            for (let k = 0; k < data.length; k += 1) {
                data[k].children = [];
            }
            for (let i = 0; i < data.length; i += 1) {
                indexed_nodes[data[i]._id] = data[i];
            }
            for (let j = 0; j < data.length; j += 1) {
                const parent = data[j].parent;
                // console.log(parent);
                if (parent === undefined) {
                    tree_roots.push(data[j]);
                } else {
                    indexed_nodes[parent].children.push(data[j]);
                }
            }
            // console.log(JSON.stringify(tree_roots, undefined, '\t'));


            res.json(tree_roots);


        })

});

app.post('/categorias', (req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        nombre: body.nombre,
        slug: body.slug,
        parent: body.parent,
        detalles: body.detalles,
    })

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            categoria: categoriaDB
        });
    })
});

app.put('/categorias/:id', (req, res) => {
    const categoriaEditada = {
        nombre: req.body.nombre,
        slug: req.body.slug,
        detalles: req.body.detalles,
    };
    Categoria.findByIdAndUpdate(req.params.id, categoriaEditada, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            categoria: categoriaDB
        });
    })
});

app.get('/categorias/:id', (req, res) => {
    console.log(`Categoría Id: ${req.params.id}`)
    Categoria
        .findById(req.params.id)
        .populate('parent', 'nombre')
        .exec((err, categoriaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.status(201).json({
                ok: true,
                categoria: categoriaDB
            });
        })
});

app.get('/categorias/slug/:slug', (req, res) => {
    console.log(`Categoría Slug: ${req.params.slug}`)
    Categoria
        .find({ slug: req.params.slug })
        .populate('parent', 'nombre')
        .exec((err, categoriaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.status(201).json({
                ok: true,
                categoria: categoriaDB
            });
        })
});

app.get('/limpiar-categorias', (req, res) => {
    Categoria
        .find({}, 'nombre detalles')
        .exec((err, categorias) => {
            categorias.forEach(element => {
                if (element.detalles && element.detalles.length > 0) {
                    element.detalles.forEach(el => {
                        if (el[2] === null) { el[2] = [] }
                        if (!(el[2].length > 0)) { el[2] = [] }
                        if (!el[3]) { el[3] = false }
                        if (!el[4]) { el[4] = false }
                    })
                }
                // Guardar
                Categoria
                    .findByIdAndUpdate(element._id, element, (err, cat) => {
                        console.log('CATid', cat._id);

                    })
            })
            console.log('FIN');

            res.status(201).json({
                ok: true,
                categoria: categorias
            });
        })

})

app.get('/crear-arbol-parent', (req, res) => {

    Categoria
        .find({}, 'nombre parent')
        .populate('parent', 'nombre')
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
            // for (let k = 0; k < data.length; k += 1) {
            //     data[k].abuelo = 'abuelo';
            // }
            for (let i = 0; i < data.length; i += 1) {
                indexed_nodes[data[i]._id] = data[i];
            }
            for (let j = 0; j < data.length; j += 1) {
                let parent = data[j].parent;

                if (parent === undefined) {
                    // console.log({ nombre: data[j].nombre, parentNODEFINIDO: parent });
                    // tree_roots.push(data[j]);
                    data[j].abuelo = undefined;
                } else {
                    // indexed_nodes[parent].children.push(data[j]);
                    // console.log({ nombre: data[j].nombre, parent: parent.nombre });
                    const abuelo = {
                        _id: '',
                        nombre: ''
                    };
                    let arrayAbuelo = data.find(el => el.parent && el._id === parent._id);
                    // console.log({ arrayAbuelo });
                    if (arrayAbuelo) {

                        abuelo._id = arrayAbuelo.parent._id;
                        abuelo.nombre = arrayAbuelo.parent.nombre;

                        data[j].abuelo = abuelo;
                    }
                }
            }
            // console.log(JSON.stringify(tree_roots, undefined, '\t'));


            res.json({
                ok: true,
                categorias: data
            });


        })

});

module.exports = app;