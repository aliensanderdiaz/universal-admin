import { ApiService } from './../servicios/api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {

  ventas: any[] = [];

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.cargarVentas();
  }

  cargarVentas() {
    this.apiService.peticionGet('ventas')
      .subscribe((data: any) => {
        this.ventas = data.ventas;
        console.log(this.ventas);
      });
  }

  async crearXML(venta_id) {
    console.log('Funcion para crear XML');
    const data: any = await this.apiService.peticionGet(`ventas/crearXML/${venta_id}`).toPromise();
    const VENTA = data.venta;
    console.log({venta: VENTA});
  }

}
