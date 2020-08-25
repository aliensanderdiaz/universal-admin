import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { FuncionesService } from '../../servicios/funciones.service';
import { BusquedaService } from '../../servicios/busqueda-categorias.service';
import { ApiService } from '../../servicios/api.service';

import { fromEvent } from 'rxjs';
import { map, switchMap, distinctUntilChanged, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-crear-marca',
  templateUrl: './crear-marca.component.html',
  styleUrls: ['./crear-marca.component.css']
})
export class CrearMarcaComponent implements OnInit {

  @ViewChild('inputCategoria') inputCategoria: ElementRef;

  buscarCategoria: boolean;

  nombre: string;
  categoriasHijas: any[] = [];
  categoriasHijasId: any[] = [];
  categorias: any[] = [];

  constructor(
    private funcionesService: FuncionesService,
    private apiService: ApiService,
    private busquedaService: BusquedaService
  ) { }

  ngOnInit() {
    this.cargarCategorias();
  }

  crearMarca() {

    if ( this.nombre === undefined) {
      swal(':(', 'Tienes que darle un nombre a la marca.', 'warning');
      return;
    }

    const marca = {
      nombre: this.nombre,
      slug: this.funcionesService.stringToSlug(this.nombre),
      categorias: this.categoriasHijasId
    };

    this.apiService.peticionesPost('marcas', marca)
      .subscribe(
        (data: any) => {
          swal(`${data.marca.nombre}`, 'Marca creada exitosamente.', 'success');
          this.categoriasHijasId = [];
          this.categoriasHijas = [];
          this.nombre = '';
        },
        (err: any) => {
          if (err.status === 0) {
            swal(':(', 'No se pudo establecer conexión con la API', 'error');
            return;
          }

          if (err.status === 500) {
            swal(':(', 'No se pudo guardar en la base de datos', 'error');
            return;
          }

          swal(':(', 'Error desconocido', 'error');

        }
    );
  }

  cargarCategorias() {
    if (!this.busquedaService.busquedaCargada) {
      this.busquedaService.obtenerCategorias('categorias-lista-completa');
    }

    fromEvent(this.inputCategoria.nativeElement, 'keyup').pipe(debounceTime(400)
    , distinctUntilChanged()
    , map((event: KeyboardEvent) => (<HTMLInputElement>event.target).value)
    , switchMap(title => this.busquedaService.obtenerCategoriasFiltradas(title)))
    .subscribe((categories: any) => {
      this.categorias = categories;
    });
  }

  elegirCategoria(categoria) {
    if (!this.categoriasHijasId.includes(categoria._id)) {
      this.categoriasHijas.push(categoria);
      this.categoriasHijasId.push(categoria._id);
    }

    this.inputCategoria.nativeElement.focus();
    this.inputCategoria.nativeElement.value = '';
    this.categorias = [];
  }

  eliminarCategoria(index) {
    this.categoriasHijas.splice(index, 1);
    this.categoriasHijasId.splice(index, 1);
  }

}
