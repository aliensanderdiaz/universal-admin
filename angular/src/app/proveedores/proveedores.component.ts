import { ApiService } from './../servicios/api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {

  proveedores: any[] = [];
  cargando: boolean = true;

  desde: number = 0;
  totalProveedores: number = 0;

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.cargarProveedores();
  }

  cargarProveedores() {
    this.apiService.peticionGet('proveedores')
      .subscribe((data: any) => {
        this.proveedores = data.proveedores;
        this.cargando = false;
      });
  }

  cambiarDesde( valor: number ) {

    const desde = this.desde + valor;
    console.log(desde);

    if ( desde >= this.totalProveedores ) {
      return;
    }

    if ( desde < 0 ) {
      return;
    }

    this.desde += valor;
    this.cargarProveedores();

  }

}
