import { ApiService } from './../../../servicios/api.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BusquedaProductosService } from '../../../servicios/busqueda-productos.service';

import { fromEvent } from 'rxjs';
import { map, switchMap, distinctUntilChanged, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-agregar-hermanos',
  templateUrl: './agregar-hermanos.component.html',
  styleUrls: ['./agregar-hermanos.component.css']
})
export class AgregarHermanosComponent implements OnInit {

  @ViewChild('inputProducto') inputProducto;

  productoId: string;
  producto: any;
  cargando: boolean = true;

  hermanos: any[] = [];
  hermanosDB: any[] = [];

  productosFiltrados: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private busquedaProductosService: BusquedaProductosService
  ) { }

  ngOnInit() {
    this.encontrarId();
  }

  encontrarId() {
    this.productoId = this.route.snapshot.params.id;
    console.log(this.productoId);
    this.traerProducto();
  }

  traerProducto() {
    this.apiService.peticionGet(`productos/${this.productoId}`)
      .subscribe((data: any) => {
        this.producto = data.producto;
        console.log(this.producto);
        this.hermanosDB = data.producto.hermanos;
        this.cargando = false;
        console.log('hermanosBD');
        console.log(this.hermanosDB);
        this.comenzarBusqueda();
      });
  }

  comenzarBusqueda() {
    this.busquedaProductosService.obtenerProductos(`productos/categoria/${this.producto.categoria._id}`);

    fromEvent(this.inputProducto.nativeElement, 'keyup').pipe(debounceTime(400)
      , distinctUntilChanged()
      , map((event: KeyboardEvent) => (<HTMLInputElement>event.target).value)
      , switchMap(title => this.busquedaProductosService.obtenerProductosFiltradosPorNombre(title)))
      .subscribe((products: any) => {
        this.productosFiltrados = products;
        console.log(this.productosFiltrados);
      });
  }

  elegirProducto(producto) {
    this.hermanos = [...this.hermanos, producto];
  }

  guardarProducto() {
    console.log(this.hermanos);
    let hermanosAnteriores = [];
    this.hermanosDB.forEach( el => {
      hermanosAnteriores = [...hermanosAnteriores, el._id];
    });
    let hermanosPost = [...hermanosAnteriores];
    this.hermanos.forEach( el => {
      hermanosPost = [...hermanosPost, el._id];
    });
    const objetoPost = {
      hermanos: hermanosPost
    };
    console.log(objetoPost);

    this.apiService.peticionesPut(`editar-hermanos/${this.producto._id}`, objetoPost)
      .subscribe((data: any) => {
        console.log(data.producto);
      });
  }

}
