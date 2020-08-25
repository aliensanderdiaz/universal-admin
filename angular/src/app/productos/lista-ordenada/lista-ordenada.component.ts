import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/servicios/api.service';
import swal from 'sweetalert';
import { FuncionesService } from 'src/app/servicios/funciones.service';
import { fromEvent, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-lista-ordenada',
  templateUrl: './lista-ordenada.component.html',
  styleUrls: ['./lista-ordenada.component.css']
})
export class ListaOrdenadaComponent implements OnInit {

  @ViewChild('nombreProducto') nombreProducto;

  marcas: any[] = [];
  marcaElegidaId: string;

  etiqueta: string;

  productos: any[] = [];
  productosFiltrados: any[] = [];

  constructor(
    private apiService: ApiService,
    private funcionesService: FuncionesService
  ) { }

  ngOnInit() {
    this.cargarMarcas();
  }

  cargarMarcas() {
    this.apiService.peticionGet('nombre-marcas-lista-completa')
      .subscribe(
        (data: any) => {
          this.marcas = data.marcas;
          // console.log(this.marcas);
        }
      )
  }

  buscar() {
    if (!this.etiqueta || !this.marcaElegidaId) {
      swal(`:|`, `No has elegido la marca o la etiqueta`, 'warning');
    } else {
      this.apiService.peticionGet(`productos-por-marca-y-etiqueta?marca=${this.marcaElegidaId}&etiqueta=${this.etiqueta}`)
        .subscribe((data: any) => {
          this.productos = data.productos;
          this.productosFiltrados = this.productos;
          this.cargarBuscador();
        })
    }
  }

  cambiarNombre(nombre, id, indice) {
    console.log({nombre, id, indice});

    const objetoNombre = {
      nombre: nombre,
      slug: this.funcionesService.stringToSlug(nombre)
    };

    this.apiService.peticionesPut(`editar-nombre/${id}`, objetoNombre)
      .subscribe((data: any) => {
        swal(`:)`, `Se cambió el nombre en la base de datos`, 'success');
        // console.log('Bien');
        // this.router.navigate(['productos', 'producto', data.producto._id]);
        this.productosFiltrados[indice].editar = false;
      });

  }

  cargarBuscador() {

    fromEvent(this.nombreProducto.nativeElement, 'keyup').pipe(debounceTime(400)
    , distinctUntilChanged()
    , map((event: KeyboardEvent) => (<HTMLInputElement>event.target).value)
    , switchMap(title => this.obtenerProductosFiltrados(title)))
    .subscribe((productos: any) => {
      this.productosFiltrados = productos;
    });
  }

  obtenerProductosFiltrados(name: string): Observable<any[]> {
    if (name === '') {
      // return of([]);
      return of(this.productos);
    } else {
      return of(this.filtrarProductos(name));
    }
  }

  filtrarProductos(name) {
    console.log('FUNCION NORMAL # 2');
    return name ? this.productos.filter((producto) => new RegExp(name, 'gi').test(producto.nombre)) : [];
    // return name ? this.listaProductos.filter((producto) => new RegExp(name, 'gi').test(producto.caracteristicas.referencia)) : [];
  }

  ordenar(termino) {

    if (termino === 'modelo' || termino === 'referencia') {
      this.productosFiltrados.sort(
        function (a, b) {
          if (a.caracteristicas[termino] > b.caracteristicas[termino]) {
            return 1;
          }
          if (a.caracteristicas[termino] < b.caracteristicas[termino]) {
            return -1;
          }
          // a must be equal to b
          return 0;
        }
      )
    }

    if ( termino === 'nombre' ) {
      this.productosFiltrados.sort(
        function (a, b) {
          if (a[termino] > b[termino]) {
            return 1;
          }
          if (a[termino] < b[termino]) {
            return -1;
          }
          // a must be equal to b
          return 0;
        }
      )
    }

    if ( termino === 'categoria' ) {
      this.productosFiltrados.sort(
        function (a, b) {
          if (a[termino].nombre > b[termino].nombre) {
            return 1;
          }
          if (a[termino].nombre < b[termino].nombre) {
            return -1;
          }
          // a must be equal to b
          return 0;
        }
      )
    }

  }

  test(producto) {
    console.log({producto});
  }

}
