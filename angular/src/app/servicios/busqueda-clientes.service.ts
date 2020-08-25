import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusquedaClientesService {

  listaClientes: any[] = [];

  constructor(
    private apiService: ApiService
  ) { }

  obtenerClientes( url ) {
    this.apiService.peticionGet( url )
      .subscribe( (data: any) => {
        this.listaClientes = data.usuarios;
      });
  }

  obtenerClientesFiltrados(name: string): Observable<any[]> {
    if (name === '') {
      return of([]);
    } else {
      return of(this.filtrarClientes(name));
    }
  }

  filtrarClientes(name) {
    return name ? this.listaClientes.filter((cliente) => new RegExp(name, 'gi').test(cliente.numeroId)) : [];
  }
}
