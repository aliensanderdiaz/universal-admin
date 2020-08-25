import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ArbolCategoriasService {

  categorias: any[] = [
    {
      _id: "5b9c9f8e4e8f84362c77dbce",
      nombre: "Cocina y Mesa",
      children: [
        {
          _id: "5bb292cbc214051450d3bbc8",
          nombre: "Baterías de cocina",
          children: []
        },
        {
          _id: "5cba814462f65623a477a2bf",
          nombre: "Básculas de cocina",
          children: []
        },
        {
          _id: "5bb2970cc214051450d3bbcb",
          nombre: "Cacerolas",
          children: []
        },
        {
          _id: "5bb019070f50942f28a35119",
          nombre: "Cubiertos",
          children: []
        },
        {
          _id: "5caa6cdb7f77cf1bd015e9c3",
          nombre: "Gabinetes",
          children: []
        },
        {
          _id: "5bb28cfec214051450d3bbc2",
          nombre: "Molinos",
          children: []
        },
        {
          _id: "5ba968319299a031cced5fdf",
          nombre: "Ollas a Presión",
          children: []
        },
        {
          _id: "5bb28b38c214051450d3bbc1",
          nombre: "Ollas y Calderos",
          children: []
        },
        {
          _id: "5bb2895ac214051450d3bbc0",
          nombre: "Sartenes",
          children: []
        },
        {
          _id: "5bb010f00f50942f28a35113",
          nombre: "Termos y Portacomidas",
          children: []
        },
        {
          _id: "5caa7e536e4f5a2174528ff8",
          nombre: "Utensilios",
          children: []
        },
        {
          _id: "5ca16f93134e1033ccb7c75a",
          nombre: "Vajillas",
          children: []
        }
      ]
    },
    {
      _id: "5b9ca00f4e8f84362c77dbcf",
      nombre: "Cuidado Personal",
      children: [
        {
          _id: "5cba85137e583442f06b98f2",
          nombre: "Planchas de Cabello",
          children: []
        },
        {
          _id: "5cba8b627e583442f06b98fd",
          nombre: "Secadores de Cabello",
          children: []
        }
      ]
    },
    {
      _id: "5b9c9f7b4e8f84362c77dbcd",
      nombre: "Electrodomésticos",
      children: [
        {
          _id: "5cba79b07e583442f06b98de",
          nombre: "Asadores Eléctricos",
          children: []
        },
        {
          _id: "5cbcbd274c958536d4255d58",
          nombre: "Aspiradoras",
          children: []
        },
        {
          _id: "5c9073c6f9e0fc1bd4ba8ef0",
          nombre: "Batidoras",
          children: []
        },
        {
          _id: "5bb03b170f50942f28a35136",
          nombre: "Cafeteras y hervidoras",
          children: []
        },
        {
          _id: "5c9ae3a88dbac8336465f94a",
          nombre: "Dispensadores de agua",
          children: []
        },
        {
          _id: "5bae4ffdec6557310c2f67bb",
          nombre: "Estufas",
          children: [
            {
              _id: "5cba6c5262f65623a477a2b1",
              nombre: "Estufas con Gabinete",
              children: []
            },
            {
              _id: "5c97fa8c48a18330d8bc993b",
              nombre: "Estufas con Horno",
              children: []
            },
            {
              _id: "5c92143db918ea1d9ccc9657",
              nombre: "Estufas electricas",
              children: []
            },
            {
              _id: "5bb049330f50942f28a35141",
              nombre: "Gasolina",
              children: []
            },
            {
              _id: "5bb04ff70f50942f28a35148",
              nombre: "Sobremesa",
              children: []
            }
          ]
        },
        {
          _id: "5ca12d5cdae1193240d79f71",
          nombre: "Exprimidores de cítricos",
          children: []
        },
        {
          _id: "5c9ae25d8dbac8336465f948",
          nombre: "Extractores de jugos",
          children: []
        },
        {
          _id: "5caa80886e4f5a2174528ffc",
          nombre: "Hornos",
          children: []
        },
        {
          _id: "5bb05ddc0f50942f28a3515b",
          nombre: "Licuadoras",
          children: []
        },
        {
          _id: "5ca2c9065c251101e8a7fdf3",
          nombre: "Loncheras",
          children: []
        },
        {
          _id: "5ba975f19299a031cced5fe4",
          nombre: "Ollas Arroceras",
          children: []
        },
        {
          _id: "5bb057b40f50942f28a35154",
          nombre: "Planchas de ropa",
          children: []
        },
        {
          _id: "5bb2d2b89f2f6126b834e607",
          nombre: "Procesadores de alimentos",
          children: []
        },
        {
          _id: "5ca19d69134e1033ccb7c78f",
          nombre: "Sandwicheras",
          children: []
        },
        {
          _id: "5cbccd894c958536d4255d5d",
          nombre: "Televisores",
          children: []
        },
        {
          _id: "5cc13f537c0a3b513058942c",
          nombre: "Tostadoras",
          children: []
        },
        {
          _id: "5ba6799f10b34e0c2cf8f334",
          nombre: "Ventiladores",
          children: [
            {
              _id: "5baea309c2ea35141ccf2789",
              nombre: "Mesa, pared y piso",
              children: []
            },
            {
              _id: "5baea48ec2ea35141ccf278a",
              nombre: "Pedestal y Multiusos",
              children: []
            },
            {
              _id: "5bb016190f50942f28a35116",
              nombre: "Techo",
              children: []
            },
            {
              _id: "5baeadf1c2ea35141ccf278e",
              nombre: "Torre",
              children: []
            }
          ]
        }
      ]
    },
    {
      _id: "5ba672fbfc85f3270c660932",
      nombre: "Zona de Ropa",
      children: []
    }
  ];

  constructor() { }
}
