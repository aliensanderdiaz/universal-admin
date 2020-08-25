import { Component, OnInit } from '@angular/core';
import { ApiService } from '../servicios/api.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  usuarios: any[] = [];
  cargando: boolean = true;

  desde: number = 0;
  totalUsuarios: number = 0;

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.apiService.peticionGet(`usuarios?desde=${this.desde}`)
      .subscribe((data: any) => {
        this.usuarios = data.usuarios;
        this.totalUsuarios = data.total;
        this.cargando = false;
      });
  }

  cambiarDesde( valor: number ) {

    const desde = this.desde + valor;
    console.log(desde);

    if ( desde >= this.totalUsuarios ) {
      return;
    }

    if ( desde < 0 ) {
      return;
    }

    this.desde += valor;
    this.cargarUsuarios();

  }

}
