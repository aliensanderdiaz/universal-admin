import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../servicios/api.service';
import { BusquedaProductosService } from '../../servicios/busqueda-productos.service';

import { fromEvent } from 'rxjs';
import { map, switchMap, distinctUntilChanged, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.component.html',
  styleUrls: ['./editar-producto.component.css']
})
export class EditarProductoComponent implements OnInit {

  @ViewChild('inputProducto') inputProducto;
  @ViewChild('inputProductoModelo') inputProductoModelo;

  productoId: string;
  producto: any;
  cargando: boolean = true;

  productosFiltrados: any[] = [];

  repuestos: any[] = [];
  accesorios: any[] = [];

  repuestosId: any[] = [];
  accesoriosId: any[] = [];

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private busquedaProductosService: BusquedaProductosService,
    private router: Router
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
        this.repuestos = this.producto.repuestos;
        this.accesoriosId = this.producto.accesorios.map(el => el._id);
        this.accesorios = this.producto.accesorios;
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

      fromEvent(this.inputProductoModelo.nativeElement, 'keyup').pipe(debounceTime(400)
      , distinctUntilChanged()
      , map((event: KeyboardEvent) => (<HTMLInputElement>event.target).value)
      , switchMap(title => this.busquedaProductosService.obtenerProductosFiltradosPorModelo(title)))
      .subscribe((productos: any) => {
        this.productosFiltrados = productos;
        console.log(this.productosFiltrados);
      });
  }

  elegirRepuesto(repuesto) {
    console.log({repuesto});
    
    if (this.repuestosId.includes(repuesto._id)) {
      swal(':(', 'Ya se encuentra en el array o base de datos', 'warning');
      return;
    }
    this.repuestos.push(repuesto);
    this.repuestosId.push(repuesto._id);
    this.productosFiltrados = [];
    this.inputProducto.nativeElement.focus();
    this.inputProducto.nativeElement.value = '';
    this.inputProductoModelo.nativeElement.value = '';
  }

  elegirAccesorio(accesorio) {
    console.log({accesorio});
    
    if (this.accesoriosId.includes(accesorio._id)) {
      swal(':(', 'Ya se encuentra en el array o base de datos', 'warning');
      return;
    }
    this.accesorios.push(accesorio);
    this.accesoriosId.push(accesorio._id);
    this.productosFiltrados = [];
    this.inputProducto.nativeElement.focus();
    this.inputProducto.nativeElement.value = '';
    this.inputProductoModelo.nativeElement.value = '';
  }

  actualizarProducto() {
    const accesoriosModificados = this.accesorios.map(element => element._id)
    const repuestosModificados = this.repuestos.map(element => element._id)
    const producto = {
      accesorios: accesoriosModificados,
      repuestos: repuestosModificados
    };

    

    this.apiService.peticionesPut(`productos/add/${this.productoId}`, producto)
      .subscribe((data: any) => {
        swal(':)', 'Producto Actualizado', 'success');
        this.router.navigate(['productos', 'producto', this.productoId])
      });
  }

  eliminarAccesorio(indice) {
    this.accesorios.splice(indice, 1);
  }

  eliminarRepuesto(indice) {
    this.repuestos.splice(indice, 1);
  }
}
