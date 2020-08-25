import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusquedaProductosPorNombreService {

  listaProductos: any[] = [];
  totalProductos: number = 0;
  cargando: boolean = true;

  constructor(private _apiService: ApiService) { }

  obtenerProductos( url ) {
    
    this._apiService.peticionGet( url )
      .subscribe( (data: any) => {
        
        this.listaProductos = data.productos;
        this.totalProductos = data.total;
      }, err => console.log('ERROR'),
      () => {
        this.cargando = false;   
      }
      );
  }

  obtenerProductosFiltrados(name: string): Observable<any[]> {
    console.log('FUNCION NORMAL # 1');
    if (name === '') {
      return of([]);
    } else {
      return of(this.filtrarProductos(name));
    }
  }

  filtrarProductos(name) {
    console.log('FUNCION NORMAL # 2');
    return name ? this.listaProductos.filter((producto) => new RegExp(name, 'gi').test(producto.nombre)) : [];
    // return name ? this.listaProductos.filter((producto) => new RegExp(name, 'gi').test(producto.caracteristicas.referencia)) : [];
  }

  obtenerProductosFiltradosPorNombre(name: string): Observable<any[]> {
    console.log('FUNCION NORMAL # 1');
    if (name === '') {
      return of([]);
    } else {
      return of(this.filtrarProductosPorNombre(name));
    }
  }

  filtrarProductosPorNombre(name) {
    console.log('FUNCION NORMAL # 2');
    // return name ? this.listaProductos.filter((producto) => new RegExp(name, 'gi').test(producto.nombre)) : [];
    return name ? this.listaProductos.filter((producto) => new RegExp(name, 'gi').test(producto.nombre)) : [];
  }

  obtenerProductosFiltradosPorReferencia(name: string): Observable<any[]> {
    console.log('FUNCION NORMAL # 1');
    if (name === '') {
      return of([]);
    } else {
      return of(this.filtrarProductosPorReferencia(name));
    }
  }

  filtrarProductosPorReferencia(name) {
    console.log('FUNCION NORMAL # 2');
    // return name ? this.listaProductos.filter((producto) => new RegExp(name, 'gi').test(producto.nombre)) : [];
    return name ? this.listaProductos.filter((producto) => new RegExp(name, 'gi').test(producto.caracteristicas.referencia)) : [];
  }

  obtenerProductosFiltradosPorModelo(name: string): Observable<any[]> {
    console.log('FUNCION NORMAL # 1');
    if (name === '') {
      return of([]);
    } else {
      return of(this.filtrarProductosPorModelo(name));
    }
  }

  filtrarProductosPorModelo(name) {
    console.log('FUNCION NORMAL # 2');
    // return name ? this.listaProductos.filter((producto) => new RegExp(name, 'gi').test(producto.nombre)) : [];
    return name ? this.listaProductos.filter((producto) => new RegExp(name, 'gi').test(producto.caracteristicas.modelo)) : [];
  }




  obtenerProductosFiltrados2(name: string, tipoBusqueda: string): Observable<any[]> {
    if (name === '') {
      return of([]);
    } else {
      return of(this.filtrarProductos2(name, tipoBusqueda));
    }
  }

  filtrarProductos2(name, tipoBusqueda: string) {
    console.log('Servicio');
    
    switch(tipoBusqueda) { 
      case 'nombre': { 
         return name ? this.listaProductos.filter((producto) => new RegExp(name, 'gi').test(producto.nombre)) : [];

      } 
      case 'referencia': { 
        return name ? this.listaProductos.filter((producto) => new RegExp(name, 'gi').test(producto.caracteristicas.referencia)) : [];

      }
      case 'modelo': { 
        return name ? this.listaProductos.filter((producto) => new RegExp(name, 'gi').test(producto.caracteristicas.modelo)) : [];

     }
   } 
  }
}
