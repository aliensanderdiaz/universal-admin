import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';

import { FuncionesService } from './../../servicios/funciones.service';
import { BusquedaService } from '../../servicios/busqueda-categorias.service';
import { fromEvent } from 'rxjs';
import { map, switchMap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { ApiService } from '../../servicios/api.service';

@Component({
  selector: 'app-crear-categoria',
  templateUrl: './crear-categoria.component.html',
  styleUrls: ['./crear-categoria.component.css']
})
export class CrearCategoriaComponent implements OnInit {

  @ViewChild('inputCategoria') inputCategoria;

  nombre: string;
  parent: any = {
    nombre: ''
  };
  detalle: string;
  categorias: any[] = [];

  opcion: string;
  unidad: string;

  agregarDetalle: boolean = false;
  mostrarBotones: boolean = true;

  agregarOpciones: boolean = false;
  agregarUnidades: boolean = false;

  detallesGlobal: any[] = [];

  opcionesParcial: string[] = [];
  unidadesParcial: string[] = [];

  buscarParent: boolean = false;

  opcionesMultiples: boolean = false;
  filtroImportante: boolean = true;

  constructor(  private funcionesService: FuncionesService,
                private busqueda: BusquedaService,
                private apiService: ApiService,
                private router: Router
              ) { }

  ngOnInit() {
    this.cargarCategorias();
  }

  crearCategoria() {
    if (this.nombre === undefined) {
      swal(':(', 'Debes escribir un nombre para la categoría', 'warning');
      return;
    }

    if (this.buscarParent) {
      swal('Busqueda de categoría padre abierta', 'Cierrala o encuentra una, para continuar', 'warning');
      return;
    }

    if (this.agregarDetalle) {
      swal('Agregar detalles esta abierta', 'Cierrala o Agregala, para continuar', 'warning');
      return;
    }
    const categoria = {
      nombre: this.nombre,
      slug: this.funcionesService.stringToSlug(this.nombre),
      detalles: this.detallesGlobal.length === 0 ? undefined : this.detallesGlobal,
      parent: this.parent._id
    };

    this.apiService.peticionesPost('categorias', categoria)
      .subscribe(
        (data: any) => {
          swal(`${data.categoria.nombre}`, 'Categoría creada exitosamente', 'success');
          this.router.navigate([`/categorias/editar-categoria/${data.categoria._id}`]);
        },
        (err: any) => {
          if (err.status === 0) {
            swal(':(', 'No se pudo establecer conexión con el servidor', 'error');
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

  elegirCategoria(categoria) {
    this.parent = categoria;
    console.log(categoria);
    this.apiService.peticionGet(`categorias/${categoria._id}`)
      .subscribe((data: any) => {
        this.detallesGlobal = data.categoria.detalles;
      });
    this.buscarParent = false;
  }

  mostrarOpciones() {
    this.mostrarBotones = false;
    this.agregarOpciones = true;
    this.agregarUnidades = false;
  }

  mostrarUnidades() {
    this.mostrarBotones = false;
    this.agregarOpciones = false;
    this.agregarUnidades = true;
  }

  agregarOpcionParcial() {
    if (this.opcion === undefined || this.opcion === '') {
      return;
    }
    this.opcionesParcial.push(this.opcion);
    this.opcion = '';
  }

  agregarUnidadParcial() {
    if (this.unidad === undefined || this.unidad === '') {
      return;
    }
    this.unidadesParcial.push(this.unidad);
    this.unidad = '';
  }

  agregarDetalleACategoria() {
    console.log('this.opcionesMultiples');
    console.log(this.opcionesMultiples);
    console.log('this.opcionesMultiples');
    if (!this.detalle) {
      swal(':(', 'No escribiste título al detalle', 'warning');
      this.agregarDetalle = false;
      return;
    }

    if (this.unidad) {
      swal('Unidad escrita', 'Agregala o borra la caja de texto', 'warning');
      return;
    }

    if (this.opcion) {
      swal('Opcion escrita', 'Agregala o borra la caja de texto', 'warning');
      return;
    }

    let detalleParcial: any[] = [
      this.detalle,
      this.funcionesService.stringToSlug(this.detalle),
      null,
      null
    ];

    if (this.agregarOpciones && this.opcionesParcial.length > 0) {
      detalleParcial[2] = this.opcionesParcial;
      detalleParcial[3] = this.filtroImportante;
      detalleParcial[4] = this.opcionesMultiples;
    }

    if (this.agregarUnidades && this.unidadesParcial.length > 0) {
      detalleParcial[2] = null;
      detalleParcial[3] = this.unidadesParcial;
      detalleParcial[4] = false;
    }

    this.detallesGlobal.push(detalleParcial);
    this.detalle = '';
    detalleParcial = [];
    this.opcionesParcial = [];
    this.unidadesParcial = [];
    this.agregarDetalle = false;
    this.mostrarBotones = true;
    this.agregarOpciones = false;
    this.agregarUnidades = false;
    this.opcionesMultiples = false;
    this.filtroImportante = true;
  }

  cargarCategorias() {
    if (!this.busqueda.busquedaCargada) {
      this.busqueda.obtenerCategorias('categorias-lista-completa');
    }

    fromEvent(this.inputCategoria.nativeElement, 'keyup').pipe(debounceTime(400)
    , distinctUntilChanged()
    , map((event: KeyboardEvent) => (<HTMLInputElement>event.target).value)
    , switchMap(title => this.busqueda.obtenerCategoriasFiltradas(title)))
    .subscribe((categories: any) => {
      this.categorias = categories;
      console.log(this.categorias);
    });
  }

}
