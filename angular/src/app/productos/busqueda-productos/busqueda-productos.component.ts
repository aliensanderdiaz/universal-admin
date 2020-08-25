import { ApiService } from './../../servicios/api.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map, switchMap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { BusquedaService } from '../../servicios/busqueda-categorias.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-busqueda-productos',
  templateUrl: './busqueda-productos.component.html',
  styleUrls: ['./busqueda-productos.component.css']
})
export class BusquedaProductosComponent implements OnInit {

  @ViewChild('inputCategoria') inputCategoria;
  categoriasFiltradas: any[] = [];

  categoriaElegida: any;

  productos: any[] = [];

  constructor(
    private busquedaService: BusquedaService,
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit() {
    this.cargarCategorias();
  }

  cargarCategorias() {

      this.busquedaService.obtenerCategorias('crear-arbol-parent');

      fromEvent(this.inputCategoria.nativeElement, 'keyup').pipe(debounceTime(400)
      , distinctUntilChanged()
      , map((event: KeyboardEvent) => (<HTMLInputElement>event.target).value)
      , switchMap(title => this.busquedaService.obtenerCategoriasFiltradas(title)))
      .subscribe((categories: any) => {
        this.categoriasFiltradas = categories;
        console.log({categoriasFiltradas: this.categoriasFiltradas});
      });

  }

  elegirCategoria(categoria) {
    this.categoriaElegida = categoria;
    this.inputCategoria.nativeElement.value = '';
    this.categoriasFiltradas = [];
    this.cargarProductos();
  }

  cargarProductos() {
    this.apiService.peticionGet(`productos/categoria/${this.categoriaElegida._id}`)
      .subscribe((data: any) => {
        this.productos = data.productos;
      });
  }

  irAProducto(productoId) {
    this.router.navigate(['productos', 'producto', productoId]);
  }

}
