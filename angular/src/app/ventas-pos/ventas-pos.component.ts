import { Component, OnInit } from '@angular/core';
import { ApiService } from '../servicios/api.service';

@Component({
  selector: 'app-ventas-pos',
  templateUrl: './ventas-pos.component.html',
  styleUrls: ['./ventas-pos.component.css']
})
export class VentasPosComponent implements OnInit {

  ventasPos: any[] = [];

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.cargarVentasPos();
  }

  cargarVentasPos() {
    this.apiService.peticionGet('pos-lista-completa')
      .subscribe(
        (data: any) => {
          console.log({ data });
          this.ventasPos = data.ventas;
        },
        (error: any) => {
          console.log({ error });
        },
        () => {
          console.log('FINALIZADO');
        },
      );
  }

}
