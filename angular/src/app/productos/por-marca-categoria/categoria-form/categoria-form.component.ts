import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BusquedaService } from 'src/app/servicios/busqueda-categorias.service';

import { fromEvent } from 'rxjs';
import { map, switchMap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { ApiService } from 'src/app/servicios/api.service';

@Component({
  selector: 'app-categoria-form',
  templateUrl: './categoria-form.component.html',
  styleUrls: ['./categoria-form.component.css']
})
export class CategoriaFormComponent implements OnInit {

  @ViewChild('inputCategoria') inputCategoria;

  idProducto: string = '';
  nombreProducto: string = '';
  indice: number = 0;

  categorias: any[] = [];
  cargando: boolean = true;

  constructor(
    public activeModal: NgbActiveModal,
    private busqueda: BusquedaService,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.cargarCategorias();
  }

  cargarCategorias() {
    if (!this.busqueda.busquedaCargada) {
      this.busqueda.obtenerCategorias('categorias-lista-completa');
    }

    this.cargando = false;

    fromEvent(this.inputCategoria.nativeElement, 'keyup').pipe(debounceTime(400)
    , distinctUntilChanged()
    , map((event: KeyboardEvent) => (<HTMLInputElement>event.target).value)
    , switchMap(title => this.busqueda.obtenerCategoriasFiltradas(title)))
    .subscribe((categories: any) => {
      this.categorias = categories;
      console.log(this.categorias);
    });
  }

  elegirCategoria2(idCategoria, nombreCategoria) {
    console.log({idCategoria, nombreCategoria});


  }

  elegirCategoria(idCategoriaNueva, nombreCategoriaNueva, productoId, indice) {
    console.log({
      idCategoriaNueva, nombreCategoriaNueva, productoId: this.idProducto, indice: this.indice
    });
    

    const objetoCategoria = {
      categoria: idCategoriaNueva
    };

    this.apiService.peticionesPut(`editar-categoria/${this.idProducto}`, objetoCategoria)
      .subscribe((data: any) => {
        swal(`:)`, `Se cambió la marca en la base de datos`, 'success');
        // console.log('Bien');
        // this.router.navigate(['productos', 'producto', data.producto._id]);

        this.activeModal.dismiss({nombreCategoriaNueva, indice: this.indice})
        // this.productosFiltrados[indice].editarMarca = false;
        // this.productosFiltrados[indice].marca.nombre = this.marcaTemp.nombre;
      });
    
  }

}
