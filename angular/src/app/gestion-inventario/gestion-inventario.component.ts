import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert';
import { ApiService } from '../servicios/api.service';

@Component({
  selector: 'app-gestion-inventario',
  templateUrl: './gestion-inventario.component.html',
  styleUrls: ['./gestion-inventario.component.css']
})
export class GestionInventarioComponent implements OnInit {

  referencia: string = 'VE7735I0';
  producto: any;
  busquedaTerminada: boolean = false;

  existencias: number;

  fecha: Date = new Date();

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit() {
  }

  log() {
    console.log(this.fecha);
  }

  buscarProducto() {
    this.producto = null;
    this.busquedaTerminada = false;
    const REFERENCIA = this.referencia.trim();

    if (REFERENCIA === '') {
      swal('ERROR!', 'Debes escribir la referencia antes de buscar', 'error');
      return;
    }

    this.apiService.peticionGet(`productos/por-referencia/${REFERENCIA}`)
      .subscribe(
        (data: any) => {
          console.log({ data });
          if (!data.ok) {
            swal('ERROR!', data.err, 'error');
            return;
          }

          this.producto = data.producto;
          console.log({ PRODUCTO: this.producto });
        },
        (error: any) => {
          swal('ERROR!', 'Ocurrió un error en la busqueda del producto', 'error');
          return;
        },
        () => {
          console.log('BUSQUEDA TERMINADA');
          this.busquedaTerminada = true;
        }
      );
  }

  crearInventario() {
    const PRODUCTO_ID = this.producto._id;

    let inventario = {
      producto: this.producto._id,
      stock: +this.existencias,
      movimientos: [{
        stockInicial: 0,
        stockFinal: +this.existencias,
        cantidad: +this.existencias,
        fecha: new Date(),
        tipo: 'Saldo Inicial'
      }]
    };

    console.log({ inventario });

    this.apiService.peticionesPost('inventarios', inventario )
      .subscribe(
        (data: any) => {
          if ( !data.ok ) {
            swal('ERROR!', data.err, 'error');
            return;
          }

          swal('Muy Bien', 'La creación del inventario fue exitoso.', 'success');
        },
        (error: any) => {
          swal('ERROR!', 'Ocurrió un error en la creación del inventario', 'error');
          return;
        },
        () => {
          console.log('FINALIZADO');
        }
      );
  }

}
