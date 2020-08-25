import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/servicios/api.service';

@Component({
  selector: 'app-venta-pos',
  templateUrl: './venta-pos.component.html',
  styleUrls: ['./venta-pos.component.css']
})
export class VentaPosComponent implements OnInit {

  ventaId: string;
  venta: any;
  cargando: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.encontrarId();
  }

  encontrarId() {
    this.ventaId = this.activatedRoute.snapshot.params.id;
    this.encontrarVenta();
  }

  encontrarVenta() {
    this.apiService.peticionGet(`pos/${ this.ventaId }`)
      .subscribe(
        ( data: any ) => {
          console.log({ data });
          this.venta = data.venta;
        },
        ( error: any ) => {
          console.log({ error });
        },
        () => {
          console.log('La petición a la API ha finalizado');
          this.cargando = false;
        }
      )
  }

}
