import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusquedaProductosService {

  listaProductos: any[] = [];

  constructor(private _apiService: ApiService) { }

  obtenerProductos( url ) {
    this._apiService.peticionGet( url )
      .subscribe( (data: any) => {
        this.listaProductos = data.productos;
        console.log('PRODUCTOS');
        console.log(this.listaProductos);
        console.log('PRODUCTOS');        
      });
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
    // return name ? this.listaProductos.filter((producto) => new RegExp(name, 'gi').test(producto.nombre)) : [];
    return name ? this.listaProductos.filter(
      (producto) => {
        return new RegExp(name, 'gi').test(producto.caracteristicas.referencia) || 
        new RegExp(name, 'gi').test(producto.caracteristicas.modelo) ||
        // producto.cmmf.includes(new RegExp(name, 'gi'))
        producto.cmmf.find(element => new RegExp(name, 'gi').test(element.codigo)) ? true : false
      }) 
      : [];
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

}
