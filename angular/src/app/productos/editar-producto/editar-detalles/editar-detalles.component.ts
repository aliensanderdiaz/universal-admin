import { ApiService } from './../../../servicios/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-editar-detalles',
  templateUrl: './editar-detalles.component.html',
  styleUrls: ['./editar-detalles.component.css']
})
export class EditarDetallesComponent implements OnInit {

  cargando: boolean = true;
  productoId: string;
  producto: any;

  detalles: any[] = [];

  detallesAnteriores: any;

  objetoDetallesTrocado: any = {};


  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit() {
    this.conocerId();
  }

  conocerId() {
    this.productoId = this.route.snapshot.params.id;
    this.cargarProducto();
  }

  cargarProducto() {
    this.apiService.peticionGet(`productos/${this.productoId}`)
      .subscribe((data: any) => {
        this.producto = data.producto;
        console.log(this.producto.categoria.nombre);
        this.detalles = data.producto.categoria.detalles;
        console.log(this.detalles);
        this.detallesAnteriores = data.producto.detalles;
        console.log({detallesAnteriores: this.detallesAnteriores});
        this.arreglarDetalles();
      });
  }

  arreglarDetalles() {
    if (this.detallesAnteriores === undefined) {
      this.detallesAnteriores = {};
    }
    this.detalles.forEach(element => {
      this.objetoDetallesTrocado[element[1]] = this.detallesAnteriores[element[1]] ? this.detallesAnteriores[element[1]] : undefined;
    });
    console.log({objetoDetallesTrocados: this.objetoDetallesTrocado});
    this.cargando = false;
  }

  editar(form: NgForm) {
    const formValues = Object.assign({}, form.value);
    const detallesObjeto =  {};

    this.detalles.forEach(element => {
      detallesObjeto[element[1]] = formValues[element[1]];
    });

    console.log(detallesObjeto);

    this.apiService.peticionesPut(`editar-detalles/${this.productoId}`, detallesObjeto)
    // this.apiService.peticionesPut(`editar-detalles/${this.productoId}`, this.detallesAnteriores)
      .subscribe((data: any) => {
        console.log(data);
        this.router.navigate(['productos', 'producto', data.producto._id]);
      });
  }

}
