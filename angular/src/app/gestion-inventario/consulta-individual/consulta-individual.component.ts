import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/servicios/api.service';

import swal from 'sweetalert';

@Component({
  selector: 'app-consulta-individual',
  templateUrl: './consulta-individual.component.html',
  styleUrls: ['./consulta-individual.component.css']
})
export class ConsultaIndividualComponent implements OnInit {

  referencia: string = 'VE7735I0';
  inventario: any;
  busquedaTerminada: boolean = false;

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit() {
  }

  log(e) {
    console.log(e);
  }

  buscarProducto() {
    this.inventario = null;
    this.busquedaTerminada = false;
    const REFERENCIA = this.referencia.trim();

    if (REFERENCIA === '') {
      swal('ERROR!', 'Debes escribir la referencia antes de buscar', 'error');
      return;
    }

    this.apiService.peticionGet(`inventarios/consulta-individual/${REFERENCIA}`)
      .subscribe(
        (data: any) => {
          console.log({ data });
          if (!data.ok) {
            swal('ERROR!', data.err, 'error');
            return;
          }

          this.inventario = data.inventario;
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

}
