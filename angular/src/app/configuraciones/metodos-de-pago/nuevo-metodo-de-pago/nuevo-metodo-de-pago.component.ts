import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/servicios/api.service';

@Component({
  selector: 'app-nuevo-metodo-de-pago',
  templateUrl: './nuevo-metodo-de-pago.component.html',
  styleUrls: ['./nuevo-metodo-de-pago.component.css']
})
export class NuevoMetodoDePagoComponent implements OnInit {

  nombre = '';
  comprobante = false;

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit() {
  }

  crearMetodoDePago() {
    const METODO_DE_PAGO = {
      nombre: this.nombre,
      comprobante: this.comprobante
    };

    this.apiService.peticionesPost('metodos-de-pago', METODO_DE_PAGO)
      .subscribe(( data: any) => {
        console.log({ data });
      }, (error: any) => {
        console.log({ error });
      }, () => {
        console.log('Terminado');
      });
  }

}
