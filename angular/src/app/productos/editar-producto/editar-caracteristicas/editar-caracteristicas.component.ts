import { ApiService } from './../../../servicios/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FuncionesService } from '../../../servicios/funciones.service';
import { ColoresService } from '../../../servicios/colores.service';

@Component({
  selector: 'app-editar-caracteristicas',
  templateUrl: './editar-caracteristicas.component.html',
  styleUrls: ['./editar-caracteristicas.component.css']
})
export class EditarCaracteristicasComponent implements OnInit {

  cargando: boolean = true;
  productoId: string;
  producto: any;
  caracteristicasAnteriores: any;
  caracteristicasSlug: string[] = [];
  colores: any[] = [];

  caracteristicas: any[] = [
    ['Modelo', 'text'],
    ['Precio', 'number'],
    ['Existencias', 'number'],
    ['Color', 'text'],
    ['Referencia', 'text'],
    ['Garantía', 'text'],
    // ['Código de Barras', 'number'],
    ['EAN13', 'text'],
    ['EAN14', 'text'],
  ];

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    private funcionesService: FuncionesService,
    private coloresService: ColoresService
  ) { }

  ngOnInit() {
    this.caracteristicasSlug = this.caracteristicas.map(element => this.funcionesService.stringToSlug(element[0]));
    this.colores = this.coloresService.obtenerColores();
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
        // console.log(this.producto.categoria.nombre);
        this.caracteristicasAnteriores = data.producto.caracteristicas;
        console.log(this.caracteristicasAnteriores);
        this.cargando = false;
      });
  }

  editar(form: NgForm) {
    const formValues = Object.assign({}, form.value);
    const caracteristicasObjeto =  {};

    this.caracteristicasSlug.forEach(element => {
      caracteristicasObjeto[element] = formValues[element];
    });

    console.log(caracteristicasObjeto);

    this.apiService.peticionesPut(`editar-caracteristicas/${this.productoId}`, caracteristicasObjeto)
      .subscribe((data: any) => {
        console.log(data);
        this.router.navigate(['productos', 'producto', data.producto._id]);
      });
  }

}
