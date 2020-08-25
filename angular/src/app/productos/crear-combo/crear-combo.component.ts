import { ApiService } from './../../servicios/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BusquedaProductosService } from '../../servicios/busqueda-productos.service';

import { fromEvent } from 'rxjs';
import { map, switchMap, distinctUntilChanged, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-crear-combo',
  templateUrl: './crear-combo.component.html',
  styleUrls: ['./crear-combo.component.css']
})
export class CrearComboComponent implements OnInit {

  @ViewChild('inputProducto') inputProducto;

  productoId: string;
  producto: any;

  idProductos: string[] = [];
  nombreProductos: string[] = [];

  productosFiltrados: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private busquedaProductosService: BusquedaProductosService,
    private router: Router
  ) { }

  ngOnInit() {
    this.conocerId();
  }

  conocerId() {
    this.productoId = this.route.snapshot.params.id;
    this.apiService.peticionGet(`productos/${this.productoId}`)
      .subscribe((data: any) => {
        this.producto = data.producto;
        console.log(this.producto);
        this.cargarBuscador();
        if (this.producto.combo.length > 0) {
          this.idProductos = this.producto.combo.map(el => el._id);
        }
      });
  }

  cargarBuscador() {
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

  elegirProducto(productoAdd) {
    if (this.idProductos.includes(productoAdd._id)) {
      swal(':(', 'Ya se encuentra en el array o base de datos', 'warning');
      return;
    }
    this.nombreProductos.push(productoAdd.nombre);
    this.idProductos.push(productoAdd._id);
    this.productosFiltrados = [];
    this.inputProducto.nativeElement.focus();
    this.inputProducto.nativeElement.value = '';
  }

  guardar() {
    const producto = {
      combo: this.idProductos
    };

    this.apiService.peticionesPut(`productos/combo/${this.productoId}`, producto)
      .subscribe((data: any) => {
        swal(':)', 'Producto Actualizado', 'success');
        this.router.navigate(['productos', 'producto', this.productoId]);
      });
  }

}
