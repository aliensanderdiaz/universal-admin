import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/servicios/api.service';
import { ActivatedRoute } from '@angular/router';
import { BusquedaProductosService } from 'src/app/servicios/busqueda-productos.service';

import { fromEvent } from 'rxjs';
import { map, switchMap, distinctUntilChanged, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-compartir-repuestos-accesorios',
  templateUrl: './compartir-repuestos-accesorios.component.html',
  styleUrls: ['./compartir-repuestos-accesorios.component.css']
})
export class CompartirRepuestosAccesoriosComponent implements OnInit {

  @ViewChild('inputProducto') inputProducto;

  productoId: string;
  producto: any;
  cargando: boolean = true;

  repuestosId: any[] = [];
  accesoriosId: any[] = [];

  productosFiltrados: any[] = [];
  productosCompartidos: any[] = [];

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private busquedaProductosService: BusquedaProductosService
  ) { }

  ngOnInit() {
    this.encontrarId();
    this.cargarProductos();
  }

  cargarProducto() {
    this.apiService.peticionGet('productos/' + this.productoId)
      .subscribe((data: any) => {
        this.producto = data.producto;
        console.log(this.producto)
        this.repuestosId = this.producto.repuestos.map(el => el._id);
        this.accesoriosId = this.producto.accesorios.map(el => el._id);
        this.cargando = false;
      });
  }

  encontrarId() {
    this.productoId = this.route.snapshot.params.id;
    this.cargarProducto();
  }

  cargarProductos() {
    this.busquedaProductosService.obtenerProductos('productos-lista-completa');

    fromEvent(this.inputProducto.nativeElement, 'keyup').pipe(debounceTime(400)
      , distinctUntilChanged()
      , map((event: KeyboardEvent) => (<HTMLInputElement>event.target).value)
      , switchMap(title => this.busquedaProductosService.obtenerProductosFiltrados(title)))
      .subscribe((productos: any) => {
        this.productosFiltrados = productos;
        console.log(this.productosFiltrados);
      });
  }

  compartir(producto) {
    console.log({
      producto,
      repuestosId: this.repuestosId,
      accesoriosId: this.accesoriosId
    });

    const OBJETOINSERTAR = {
      accesorios: this.accesoriosId,
      repuestos: this.repuestosId
    };

    

    this.apiService.peticionesPut(`productos/add/${producto._id}`, OBJETOINSERTAR)
      .subscribe((data: any) => {
        swal(':)', 'Producto Actualizado', 'success');
        // this.router.navigate(['productos', 'producto', this.productoId])
        this.productosCompartidos.push(producto)
        this.inputProducto.nativeElement.focus();
        this.inputProducto.nativeElement.value = '';
        this.productosFiltrados = [];
      });
  }

}
