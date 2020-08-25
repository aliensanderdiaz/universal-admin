import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColoresService {

  colores: any[] = [
    {
      nombre: 'Blanco',
      codigo: '#FFFFFF'
    },
    {
      nombre: 'Negro',
      codigo: '#000000'
    },
    {
      nombre: 'Rojo',
      codigo: '#FF0000'
    },
    {
      nombre: 'Verde',
      codigo: '#009900'
    },
    {
      nombre: 'Rosado',
      codigo: '#FFCCCC'
    }
  ];

  constructor() { }

  obtenerColores(): any[] {
    return this.colores;
  }
}
