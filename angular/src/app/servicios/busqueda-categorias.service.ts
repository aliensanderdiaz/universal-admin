import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusquedaService {

  busquedaCargada: boolean = false;
  listaCategorias: any[] = [];
  listaCategoriasAdecuadas: any[] = [];
  listaCategoriasPrincipales: any[] = [];

  constructor(private _apiService: ApiService) { }

  obtenerCategorias( url ) {
    this._apiService.peticionGet( url )
      .subscribe( (data: any) => {
        this.listaCategorias = data.categorias;
        this.busquedaCargada = true;
        console.log('LISTA DE CATEGORIAS COMPLETA this.listaCategorias SERVICIO');
        console.log(this.listaCategorias);
        console.log('LISTA DE CATEGORIAS COMPLETA this.listaCategorias SERVICIO');
      });
  }

  obtenerCategoriasFiltradas(name: string): Observable<any[]> {
    console.log('FUNCION NORMAL # 1');
    if (name === '') {
      return of([]);
    } else {
      return of(this.filtrarCategorias(name));
    }
  }

  filtrarCategorias(name) {
    console.log('FUNCION NORMAL # 2');
    return name ? this.listaCategorias.filter((category) => new RegExp(name, 'gi').test(category.nombre)) : [];
  }

  obtenerCategoriasFiltradasAdecuadas(name: string): Observable<any[]> {
    console.log('FUNCION FILTRADA # 1');
    if (name === '') {
      return of([]);
    } else {
      return of(this.filtrarCategoriasAdecuadas(name));
    }
  }

  filtrarCategoriasAdecuadas(name) {
    console.log('FUNCION FILTRADA # 2');
    this.listaCategoriasAdecuadas = this.listaCategorias.filter((categoria: any) => {
      return categoria.detalles.length === 0 && categoria.parent;
    });
    console.log(this.listaCategoriasAdecuadas);
    return name ? this.listaCategoriasAdecuadas.filter((category) => new RegExp(name, 'gi').test(category.nombre)) : [];
  }

  obtenerCategoriasFiltradasPrincipales(name: string): Observable<any[]> {
    console.log('FUNCION Principales # 1');
    if (name === '') {
      return of([]);
    } else {
      return of(this.filtrarCategoriasPrincipales(name));
    }
  }

  filtrarCategoriasPrincipales(name) {
    console.log('FUNCION Principales # 2');
    this.listaCategoriasPrincipales = this.listaCategorias.filter((categoria: any) => {
      return categoria.detalles.length > 0;
    });
    console.log(this.listaCategoriasPrincipales);
    return name ? this.listaCategoriasPrincipales.filter((category) => new RegExp(name, 'gi').test(category.nombre)) : [];
  }
}
