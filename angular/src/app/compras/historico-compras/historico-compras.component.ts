import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../servicios/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-historico-compras',
  templateUrl: './historico-compras.component.html',
  styleUrls: ['./historico-compras.component.css']
})
export class HistoricoComprasComponent implements OnInit {

  productoId: string;
  compras: any[] = [];
  combos: any[] = [];
  producto: any;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.encontrarId();
    this.encontrarProducto();
    this.buscarCompras();
    this.buscarCombos();
  }

  encontrarId() {
    this.productoId = this.route.snapshot.params.id;
  }

  encontrarProducto() {
    console.log('Buscando Producto');
    this.apiService.peticionGet('productos/' + this.productoId)
    .subscribe((data: any) => {
      this.producto = data.producto;
      console.log('PRODUCTO', this.producto);
    });
  }

  buscarCompras() {
    this.apiService.peticionGet('historico-compras/' + this.productoId)
      .subscribe((response: any) => {
        // console.log({compras: response});
        
        const compras = response.compras;
        this.compras = [];
        compras.forEach(element => {
          const compra = {
            _id: element._id,
            supplierDate: element.supplierDate,
            linea: element.products.find(element2 => element2.productId._id === this.productoId)
          }
          this.compras.push(compra);
        });

        this.compras.sort(
          function (a, b) {
            if (a.supplierDate > b.supplierDate) {
              return -1;
            }
            if (a.supplierDate < b.supplierDate) {
              return 1;
            }
            // a must be equal to b
            return 0;
          }
        )
        // console.log(this.compras);  
        // this.compras = []      
      })
  }

  buscarCombos() {
    this.apiService.peticionGet('historico-combos/' + this.productoId)
      .subscribe((response: any) => {
        // console.log({combos: response});
        
        const combos = response.combos;
        console.log({combos});
        
        this.combos = [];
        
        combos.forEach(element => {

          const combo = {
            _id: element._id,
            supplierDate: element.supplierDate,
            linea: undefined
          }

          const LINEAS_COMBOS = element.products.filter(element2 => element2.productos.length > 0);

          console.log({LINEAS_COMBOS});

          const ARRAY_LINEAS_COMBOS = [];

          LINEAS_COMBOS.forEach(element3 => {
            ARRAY_LINEAS_COMBOS.push(...element3.productos)
          });

          const LINEAS_COMBOS_PRODUCTO = ARRAY_LINEAS_COMBOS.filter(element4 => element4.productId._id === this.productoId)

          console.log({LINEAS_COMBOS_PRODUCTO});
          
          LINEAS_COMBOS_PRODUCTO.forEach(element5 => {
            combo.linea = element5;
            this.combos.push(combo);
          });
          
        });

        this.combos.sort(
          function (a, b) {
            if (a.supplierDate > b.supplierDate) {
              return -1;
            }
            if (a.supplierDate < b.supplierDate) {
              return 1;
            }
            // a must be equal to b
            return 0;
          }
        )

      })
  }

  irACompra(compraId) {
    this.router.navigate(['compras', 'compra', compraId])
  }

}
