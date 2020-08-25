import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert';
import { ApiService } from 'src/app/servicios/api.service';
import { FuncionesService } from 'src/app/servicios/funciones.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-producto-sencillo',
  templateUrl: './crear-producto-sencillo.component.html',
  styleUrls: ['./crear-producto-sencillo.component.css']
})
export class CrearProductoSencilloComponent implements OnInit {

  referenciaExiste: boolean = true;
  referencia: string = '';
  nombre: string = '';
  ean13: string = '';
  ean14: string = '';

  productoId: string = '';

  datax = [0.1, 0.001, 0.001, 1, 10, 100, 1000, 10000];
  // datax = [1, 10, 100, 1000, 10000];
  data = 'Hola';

  constructor(
    private apiService: ApiService,
    private funcionesService: FuncionesService,
    private router: Router
  ) { }

  ngOnInit() {
    this.data = 'Hello';
  }

  buscarReferencia() {
    swal(':|', 'Buscando...', 'success')
    if (this.referencia.trim() === '') {
      swal(':(', 'Debes escribir una referencia', 'warning');
      return;
    }
    
    this.apiService.peticionGet(`productos/referencia/${this.referencia.trim()}`)
      .subscribe((data: any) => {
        console.log(data.productos.length);
        if (data.productos.length === 0) {
          console.log('No hay productos');
          this.referenciaExiste = false;
        } else {
          console.log(this.referencia.trim());
          swal(':(', `Ya existe un producto en la base de datos con esa referencia ${this.referencia}`, 'warning');
        }
      });

  }

  crearRepuesto() {
    if (this.referencia === '') {
      swal(':(', 'El nombre es obligatorio', 'warning');
      return;
    }

    const producto = {
      etiqueta: 'Repuesto',
      marca:     '5bae77a0baebd02d50bb89cb', // Generico
      categoria: '5ca13d4ddae1193240d79f7c', // Repuestos y Accesorios - Estufas
      caracteristicas: {
          referencia: this.referencia.trim(),
          modelo: this.referencia.trim(),
          ean13: this.ean13.trim(),
          ean14: this.ean14.trim(),
      },
      nombre: this.nombre.trim(),
      slug: this.funcionesService.stringToSlug(this.nombre.trim())
    }

    console.log({producto});

    this.apiService.peticionesPost('productos', producto)
      .subscribe((data: any) => {
        this.productoId = data.producto._id;
        swal(`Muy bien`, `Producto con Id ${this.productoId} creado`, 'success');
        this.router.navigate([`/productos/producto/${this.productoId}`]);
      });
    
  }

}
