const express = require('express');

let app = express();

let GrupoDeInventario = require('../models/grupo-de-inventario.model');
let Categoria = require('../models/categoria.model');
let Producto = require('../models/producto.model');

app.get('/grupo-de-inventario', (req, res) => {

})

app.post('/grupo-de-inventario', (req, res) => {

    let body = req.body;

    let grupoDeInventario = new GrupoDeInventario({
        nombre: body.nombre
    })

    grupoDeInventario.save((err, grupoDeInventarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            grupoDeInventario: grupoDeInventarioDB
        });
    })

})

app.get('/grupo-de-inventario/categorias-repuestos', (req, res) => {
    Categoria
        .find()
        .populate({ path: 'parent', select: 'nombre' })
        .select('nombre parent')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            let CATEGORIAS_REPUESTOS = [];

            categorias.forEach(
                categoria => {
                    if (
                            categoria.nombre &&
                            categoria.nombre === 'Repuestos y Accesorios' ||
                            (
                                categoria.parent && 
                                categoria.parent.nombre && 
                                categoria.parent.nombre === 'Repuestos y Accesorios'
                            )
                        ) {
                        CATEGORIAS_REPUESTOS.push( categoria._id );
                    }
                }
            )

            res.json({
                ok: true,
                categorias: CATEGORIAS_REPUESTOS
            });


        })
})


const CATEGORIAS_REPUESTOS = [
    "5b92427d58beb6055354078f",
    "5b9243c558beb60553540791",
    "5b922eb358beb60553540781",
    "5ba222d834dfda0d50b17b52",
    "5b923a4058beb60553540789",
    "5ba965509299a031cced5fde",
    "5ba9874c9299a031cced5fed",
    "5b92456658beb60553540793",
    "5ba2221434dfda0d50b17b4e",
    "5ba97ec49299a031cced5fe5",
    "5b923ca958beb6055354078b",
    "5ba987da9299a031cced5ff1",
    "5b924a4958beb6055354079a",
    "5ba987089299a031cced5fec",
    "5ba987819299a031cced5fee",
    "5ba9885b9299a031cced5ff3",
    "5b9236ba58beb60553540785",
    "5ba2213b34dfda0d50b17b4c",
    "5ba986de9299a031cced5feb",
    "5ba987bc9299a031cced5ff0",
    "5bafbc4730866231cc6f6778",
    "5bafc32a30866231cc6f677d",
    "5b92388a58beb60553540787",
    "5ba2227034dfda0d50b17b50",
    "5ba988479299a031cced5ff2",
    "5bafd7c3e784af26c8bf02b0",
    "5bafe0d3e784af26c8bf02b6",
    "5ba968ad9299a031cced5fe0",
    "5ba97fde9299a031cced5fe9",
    "5bafb99d30866231cc6f6775",
    "5b92492e58beb60553540798",
    "5ba21bca34dfda0d50b17b48",
    "5bafba9c30866231cc6f6776",
    "5bafbf7e30866231cc6f677b",
    "5bafc41130866231cc6f677e",
    "5bafb8df30866231cc6f6773",
    "5ba226a934dfda0d50b17b56",
    "5ba2233434dfda0d50b17b54",
    "5ba97f409299a031cced5fe7",
    "5ba222a634dfda0d50b17b51",
    "5ba223a934dfda0d50b17b55",
    "5ba97f129299a031cced5fe6",
    "5ba212b634dfda0d50b17b47",
    "5ba2223b34dfda0d50b17b4f",
    "5ba222e734dfda0d50b17b53",
    "5bafbf0e30866231cc6f6779",
    "5ba221e534dfda0d50b17b4d",
    "5ba97f789299a031cced5fe8",
    "5ba980199299a031cced5fea",
    "5ba987a59299a031cced5fef",
    "5bafb78030866231cc6f6772",
    "5bafb95a30866231cc6f6774",
    "5bafbf4330866231cc6f677a",
    "5bb3c8073d4a500a78f64c4c",
    "5bb3cec13d4a500a78f64c52",
    "5bb3cb0b3d4a500a78f64c4e",
    "5bb2d4639f2f6126b834e60b",
    "5bb3ebfc3d4a500a78f64c5f",
    "5bb3dcb83d4a500a78f64c59",
    "5bb03b7a0f50942f28a35138",
    "5bb3ea253d4a500a78f64c5d",
    "5bb2b2cdc214051450d3bbda",
    "5bb03b410f50942f28a35137",
    "5bb2d2e39f2f6126b834e608",
    "5bb3d9d73d4a500a78f64c56",
    "5bb3cc483d4a500a78f64c50",
    "5bb2d32f9f2f6126b834e609",
    "5c9339483d38870e60a9727c",
    "5c981b0348a18330d8bc9951",
    "5c9b103e8dbac8336465f96a",
    "5c9b108c8dbac8336465f96b",
    "5ca12284dae1193240d79f6c",
    "5ca12d7cdae1193240d79f72",
    "5ca13d4ddae1193240d79f7c",
    "5ca13d8bdae1193240d79f7d",
    "5ca13d9ddae1193240d79f7e",
    "5ca13e0cdae1193240d79f7f",
    "5ca14585dae1193240d79f84",
    "5ca14a3fdae1193240d79f89",
    "5ca14c8fdae1193240d79f8c",
    "5ca14f52dae1193240d79f91",
    "5ca17a05134e1033ccb7c765",
    "5ca193b8134e1033ccb7c780",
    "5ca195b5134e1033ccb7c784",
    "5caa79ea6e4f5a2174528ff5",
    "5caa9d2f6e4f5a217452900a",
    "5caac6bc9db3f429fc0593a6",
    "5cb4eceab7720a2af4e5664d",
    "5cb4ee54b7720a2af4e5664f",
    "5cb542063699bf2cf4f964d8",
    "5cb542ab3699bf2cf4f964da",
    "5cba1e327e583442f06b9841",
    "5cba64fc7e583442f06b98ab",
    "5cba79e97e583442f06b98df",
    "5cba853a7e583442f06b98f3",
    "5cba8b817e583442f06b98fe",
    "5cbca6264c958536d4255d54",
    "5cc142d27c0a3b513058942e",
    "5cc19d34766f120bec1c079d",
    "5cd134b5de55cc2b345c69f0"
];    

app.get('/grupo-de-inventario/categorias-repuestos/productos', (req, res) => {
    Producto
        .find()
        .where('categoria')
        .in(CATEGORIAS_REPUESTOS)
        .select('nombre')
        .sort({ nombre: 1 })
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            productos.forEach(
                async producto => {
                    await Producto
                        .findByIdAndUpdate( producto._id, { grupo_de_inventario: '5db1388d785c544b08dc2311' });
                        console.log(producto.nombre);
                }
            )
            

            res.json({
                ok: true,
                productos
            });
        })
})


app.get('/grupo-de-inventario/categorias/:categoria/:grupo_de_inventario_id', (req, res) => {

    // console.log(req.query)
    console.log(req.params.categoria)
    
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

            const CATEGORIA = tree_roots.find( categoria => categoria.nombre === req.params.categoria);
            let CATEGORIAS_IDS = [CATEGORIA._id];

            CATEGORIA.children.forEach(
                categoria => {
                    CATEGORIAS_IDS.push( categoria._id );
                    categoria.children.forEach(
                        categoria_hija => CATEGORIAS_IDS.push( categoria_hija._id )
                    )
                }
            )

            Producto
                .find()
                .where('categoria')
                .in(CATEGORIAS_IDS)
                .select('nombre')
                .sort({ nombre: 1 })
                .exec((err, productos) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    }

                    productos.forEach(
                        async producto => {
                            await Producto
                                .findByIdAndUpdate( producto._id, { grupo_de_inventario: req.params.grupo_de_inventario_id });
                                console.log(producto.nombre);
                        }
                    )
                    

                    res.json({
                        ok: true,
                        productos
                    });
                })




            // res.json({
            //     ok: true,
            //     // categorias: tree_roots,
            //     categorias: CATEGORIA,
            //     categorias_id: CATEGORIAS_IDS
            // });


        })

})


module.exports = app;