import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusquedaProveedoresService {

  listaProveedores: any[] = [];

  constructor(
    private apiService: ApiService
  ) { }

  obtenerProveedores( url ) {
    this.apiService.peticionGet( url )
      .subscribe( (data: any) => {
        this.listaProveedores = data.usuarios;
        console.log('LISTA DE proveedores COMPLETA this.listaproveedores');
        console.log(this.listaProveedores);
        console.log('LISTA DE proveedores COMPLETA this.listaproveedores');
      });
  }

  obtenerProveedoresFiltrados(name: string): Observable<any[]> {
    console.log('FUNCION NORMAL # 1');
    if (name === '') {
      return of([]);
    } else {
      return of(this.filtrarProveedores(name));
    }
  }

  filtrarProveedores(name) {
    console.log('FUNCION NORMAL # 2');
    return name ? this.listaProveedores.filter((proveedor) => new RegExp(name, 'gi').test(proveedor.primerNombre)) : [];
  }
}
