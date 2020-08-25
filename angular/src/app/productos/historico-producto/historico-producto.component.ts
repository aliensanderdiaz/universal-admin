import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/servicios/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-historico-producto',
  templateUrl: './historico-producto.component.html',
  styleUrls: ['./historico-producto.component.css']
})
export class HistoricoProductoComponent implements OnInit {

  productoId: string;
  producto: any;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.encontrarId();
    this.cargarHistoria();
  }

  encontrarId() {
    this.productoId = this.route.snapshot.params.id;
  }

  cargarHistoria() {
    this.apiService.peticionGet(`historico-productos/${this.productoId}`)
      .subscribe(
        (data: any) => {
          this.producto = data.producto;
          console.log(this.producto);
        }
      )
  }

  irACompra(compraId) {
    this.router.navigate(['compras', 'compra', compraId]);
  }

}
