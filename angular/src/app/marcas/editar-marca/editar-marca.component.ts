import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BusquedaService } from '../../servicios/busqueda-categorias.service';

import { fromEvent } from 'rxjs';
import { map, switchMap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { ApiService } from '../../servicios/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-editar-marca',
  templateUrl: './editar-marca.component.html',
  styleUrls: ['./editar-marca.component.css']
})
export class EditarMarcaComponent implements OnInit {

  @ViewChild('inputCategoria') inputCategoria: ElementRef;

  cambios: boolean = false;
  categorias: any[] = [];
  categoriasElegidas: any[] = [];
  categoriasElegidasId: any[] = [];
  marcaId: string = '';
  marca: any;

  constructor(
    private route: ActivatedRoute,
    private busquedaService: BusquedaService,
    private apiService: ApiService,
    private router: Router
  ) {
    this.marcaId = this.route.snapshot.params.id;
  }

  ngOnInit() {
    this.cargarMarca();
    this.cargarCategorias();
  }

  cargarMarca() {
    this.apiService.peticionGet(`marcas/${this.marcaId}`)
      .subscribe((data: any) => {
        this.marca = data.marca;
        const categoriasDB = data.marca.categorias;
        for (let i = 0; i < categoriasDB.length; i++) {
          this.categoriasElegidasId.push(categoriasDB[i]._id);
          this.categoriasElegidas.push(`${categoriasDB[i].nombre} - Parent: ${categoriasDB[i].parent.nombre}`);
        }
      });
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
    if (!categoria.parent) {
      swal(':C', 'La categoría no tiene parent', 'error');
      this.categorias = [];
      this.inputCategoria.nativeElement.value = '';
      this.inputCategoria.nativeElement.focus();
      return;
    }

    if (this.categoriasElegidasId.includes(categoria._id)) {
      swal(':C', 'La marca ya tiene asignada esta categoría', 'error');
      this.categorias = [];
      this.inputCategoria.nativeElement.value = '';
      this.inputCategoria.nativeElement.focus();
      return;
    }
    this.cambios = true;
    const categoria_temp = `${categoria.nombre} - Parent: ${categoria.parent.nombre}`;
    this.categoriasElegidas.push(categoria_temp);
    this.categoriasElegidasId.push(categoria._id);
    this.categorias = [];
    this.inputCategoria.nativeElement.value = '';
    this.inputCategoria.nativeElement.focus();
  }

  quitarCategoria(categoria_indice) {
    this.cambios = true;
    this.categoriasElegidas.splice(categoria_indice, 1);
    this.categoriasElegidasId.splice(categoria_indice, 1);
  }

  editarMarca() {
    if (this.categoriasElegidasId.length === 0) {
      swal(':(', 'No tienes categorias agregadas', 'error');
      return;
    }

    if (!this.cambios) {
      swal(':(', 'No se han detectado cambios', 'error');
      return;
    }
    const url = 'marcas/' + this.marcaId;
    this.apiService.peticionesPut(url, {categorias: this.categoriasElegidasId})
      .subscribe((data: any) => {
        swal('Excelente', 'Marca Actualizada', 'success');
        this.router.navigate([`/marcas/marca/${this.marcaId}`]);
      });
  }

}
