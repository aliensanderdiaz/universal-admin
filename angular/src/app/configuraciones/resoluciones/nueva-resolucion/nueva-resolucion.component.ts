import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/servicios/api.service';

@Component({
  selector: 'app-nueva-resolucion',
  templateUrl: './nueva-resolucion.component.html',
  styleUrls: ['./nueva-resolucion.component.css']
})
export class NuevaResolucionComponent implements OnInit {

  nombre = '';
  prefijo = '';
  numeracionInicial: number;
  numeracionFinal: number;
  fechaInicio: Date;
  fechaVencimiento: Date;
  activo = true;
  metodosDePago: any[] = ['5d92482c37c2d23e181bbc9c', '5d92485e37c2d23e181bbc9d', '5d92487137c2d23e181bbc9e', '5d92490737c2d23e181bbc9f'];

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit() {
  }

  crearResolucion() {
    const RESOLUCION = {
      nombre: this.nombre,
      prefijo: this.prefijo,
      numeracionInicial: this.numeracionInicial,
      numeracionFinal: this.numeracionFinal,
      fechaInicio: this.fechaInicio,
      fechaVencimiento: this.fechaVencimiento,
      activo: this.activo,
      metodosDePago: this.metodosDePago,
    };

    this.apiService.peticionesPost('resoluciones', RESOLUCION)
      .subscribe(
        (data: any) => {
          console.log({ data });
        },
        (error: any) => {
          console.log({ error });
        },
        () => {
          console.log('Terminado');
        }
      );
  }

}
