import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/servicios/api.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-editar-hermandad',
  templateUrl: './editar-hermandad.component.html',
  styleUrls: ['./editar-hermandad.component.css']
})
export class EditarHermandadComponent implements OnInit {

  stringBusqueda: string = '';
  indiceMostrar: number = 0;

  hermandadId: string;
  hermandad: any;
  productosBusqueda: any[] =[];
  productosHermandad: any[] = [];

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.cargarHermandad();
  }

  cargarHermandad() {
    this.route.params.subscribe(
      (params: Params) => {
        this.hermandadId = params['id'];

        this.apiService.peticionGet(`hermandad/${this.hermandadId}`)
          .subscribe((data: any) => {
            this.hermandad = data.hermandad;
            console.log(this.hermandad);
            
          })
      }
    )
  }

  buscar() {
    this.apiService.peticionGet(`productos-por-modelo?modelo=${this.stringBusqueda}`)
      .subscribe((data: any) => {
        this.productosBusqueda = data.productos;
      })
  }

  agregarALaHermandad(producto) {
    this.productosHermandad.push(producto);
  }

  agregarTodos() {
    this.productosHermandad = this.productosBusqueda.map(producto => {

      const nuevoProducto = {
        _id: producto._id,
        nombre: producto.nombre
      }

      this.hermandad.propiedades.forEach(propiedad => {
        nuevoProducto[propiedad.codigo] = '';
      });

      return nuevoProducto;
    });

    this.productosBusqueda = [];
    console.log(this.productosHermandad);
    
  }

  guardarHermandad() {
    const productos = this.productosHermandad.map(producto => {

      const nuevoProducto = {
        producto: producto._id
      }

      const detalles = {};

      this.hermandad.propiedades.forEach(propiedad => {
        detalles[propiedad.codigo] = producto[propiedad.codigo];
      });

      nuevoProducto['detalles'] = detalles;

      return nuevoProducto;

      // return {
      //   producto: producto._id,
      //   detalles: {
      //     quemador: producto.quemador,
      //     gas: producto.gas
      //   }
      // }
    })
    console.log({productos});
    this.apiService.peticionesPut(`hermandad/${this.hermandadId}`, {productos})
      .subscribe((data: any) => {
        console.log('Respuesta desde la edicion');
        console.log(data);
      })
  }

  cambiarIndiceMostrar(indice) {
    this.indiceMostrar = indice;
  }

}
