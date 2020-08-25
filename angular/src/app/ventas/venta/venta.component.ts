import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../servicios/api.service';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {

  venta: any;
  ventaId: string;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.ventaId = this.route.snapshot.params.id;
    this.cargarVenta();
  }

  cargarVenta() {
    this.apiService.peticionGet('ventas/' + this.ventaId)
      .subscribe((data: any) => {
        this.venta = data.venta;
        console.log(this.venta);
      });
  }

}
