import { FuncionesService } from './../../servicios/funciones.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../servicios/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit, OnDestroy {

  productoId: string;
  producto: any;
  cargando: boolean = true;
  caracteristicas: string[] = [];
  detalles: string[] = [];
  cambiarNombre: boolean = false;

  caracteristicasCap: any[] = [
    ['Modelo', 'modelo'],
    ['Precio', 'precio'],
    ['Existencias', 'existencias'],
    ['Color', 'color'],
    ['Referencia', 'referencia'],
    ['Garantía', 'garantia'],
    // ['Código de Barras', 'codigo_de_barras'],
    ['EAN13', 'ean13'],
    ['EAN14', 'ean14'],
  ];

  detallesCap: string[] = [];

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private funcionesService: FuncionesService,
    private router: Router
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
  }

  ngOnInit() {
    this.encontrarId();
  }

  ngOnDestroy() {
    this.productoId = '';
  }

  cargarProducto() {
    this.apiService.peticionGet('productos/' + this.productoId)
      .subscribe((data: any) => {
        this.producto = data.producto;
        this.producto.detalles = this.producto.detalles || {};
        console.log({ producto: this.producto });
        this.caracteristicas = Object.keys(this.producto.caracteristicas);
        this.detalles = this.producto.categoria.detalles.map(element => element[1]);
        // this.detalles = this.producto.categoria.detalles.map(element => element[1]) ? this.producto.categoria.detalles.map(element => element[1]) : {};
        this.detallesCap = this.producto.categoria.detalles.map(element => element[0]);
        console.log(this.detalles);
        console.log(this.detallesCap);
        this.cargando = false;
      });
  }

  encontrarId() {
    this.productoId = this.route.snapshot.params.id;
    this.cargarProducto();
  }

  irAProductoTest() {
    this.router.navigate(['productos', 'producto', 'gdgdfg']);
  }

  guardar() {

    const objetoNombre = {
      nombre: this.producto.nombre,
      slug: this.funcionesService.stringToSlug(this.producto.nombre)
    };
    console.log(this.producto.nombre);
    this.apiService.peticionesPut(`editar-nombre/${this.productoId}`, objetoNombre)
      .subscribe((data: any) => {
        console.log('Bien');
        // this.router.navigate(['productos', 'producto', data.producto._id]);
        this.cambiarNombre = false;
      });
  }

}
