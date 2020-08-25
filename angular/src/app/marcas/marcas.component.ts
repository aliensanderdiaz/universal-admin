import { Component, OnInit } from '@angular/core';
import { ApiService } from '../servicios/api.service';

@Component({
  selector: 'app-marcas',
  templateUrl: './marcas.component.html',
  styleUrls: ['./marcas.component.css']
})
export class MarcasComponent implements OnInit {

  marcas: any[] = [];
  desde: number = 0;

  totalMarcas: number = 0;
  cargando: boolean = true;

  constructor( private apiService: ApiService ) { }

  ngOnInit() {
    this.cargarMarcas();
  }

  cargarMarcas() {
    this.apiService.peticionGet('marcas?desde=' + this.desde)
      .subscribe((data: any) => {
        this.marcas = data.marcas;
        this.totalMarcas = data.total;
      });
  }

  cambiarDesde( valor: number ) {

    const desde = this.desde + valor;
    console.log(desde);

    if ( desde >= this.totalMarcas ) {
      return;
    }

    if ( desde < 0 ) {
      return;
    }

    this.desde += valor;
    this.cargarMarcas();

  }

}
