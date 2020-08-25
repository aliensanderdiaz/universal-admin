import { BusquedaProveedoresService } from './../../../servicios/busqueda-proveedores.service';
import { ApiService } from './../../../servicios/api.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { fromEvent } from 'rxjs';
import { map, switchMap, distinctUntilChanged, debounceTime } from 'rxjs/operators';

import swal from 'sweetalert';

@Component({
  selector: 'app-agregar-videos-cmmf',
  templateUrl: './agregar-videos-cmmf.component.html',
  styleUrls: ['./agregar-videos-cmmf.component.css']
})
export class AgregarVideosCmmfComponent implements OnInit {

  @ViewChild('inputProveedor') inputProveedor;

  cargando: boolean = true;
  productoId: string;

  producto: any;

  videosAnteriores: string[];
  cmmfAnteriores: any[];

  videosNuevos: string[] = [];
  cmmfNuevos: any[] = [];

  videoUrl: string = '';
  proveedoresFiltrados: any[] = [];
  proveedorElegido: any = {
    nombre: ''
  };
  cmmf: string = '';
  cmmfProveedores: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private busquedaProveedoresService: BusquedaProveedoresService
  ) { }

  ngOnInit() {
    this.encontrarId();
  }

  encontrarId() {
    this.productoId = this.route.snapshot.params.id;
    this.cargarProducto();
  }

  cargarProducto() {
    this.apiService.peticionGet(`productos/${this.productoId}`)
      .subscribe((data: any) => {
        this.producto = data.producto;
        this.videosAnteriores = data.producto.videos;
        this.cmmfAnteriores = data.producto.cmmf;
        console.log(this.cmmfAnteriores);
        this.cargarProveedores();
        this.cargando = false;
      });
  }

  agregarVideo() {
    if (!this.videoUrl) {
      swal(':(', 'No has escrito ninguna url', 'error');
      return;
    }
    this.videosNuevos.push(this.videoUrl);
    this.videoUrl = '';
  }

  elegirProveedor(proveedor) {
    this.proveedorElegido = proveedor;
    this.inputProveedor.nativeElement.focus();
    this.inputProveedor.nativeElement.value = '';
    this.proveedoresFiltrados = [];
  }

  guardarCmmf() {
    // console.log('Guardar cmmf', this.proveedorElegido.primerNombre.length, this.cmmf);
    if (!this.proveedorElegido.primerNombre || !this.cmmf) {
      swal(':(', 'Imposible añadir CMMF', 'error');
      return;
    }
    const cmmfUnit = {
      proveedor: this.proveedorElegido._id,
      codigo: this.cmmf,
    };
    this.cmmfNuevos.push(cmmfUnit);
    this.cmmfProveedores.push(this.proveedorElegido.primerNombre);
    this.cmmf = '';
    this.proveedorElegido = {
      nombre: ''
    };
    console.log({cmmfNuevos: this.cmmfNuevos});
  }

  cargarProveedores() {
    if (this.busquedaProveedoresService.listaProveedores = []) {
      this.busquedaProveedoresService.obtenerProveedores('usuarios-por-tipo-lista-completa?tipo=proveedor');
    }

    fromEvent(this.inputProveedor.nativeElement, 'keyup').pipe(debounceTime(400)
      , distinctUntilChanged()
      , map((event: KeyboardEvent) => (<HTMLInputElement>event.target).value)
      , switchMap(title => this.busquedaProveedoresService.obtenerProveedoresFiltrados(title)))
      .subscribe((provedores: any) => {
        this.proveedoresFiltrados = provedores;
        console.log(this.proveedoresFiltrados);
      });
  }

  grabarCmmf() {
    const anteriores = [];
    this.cmmfAnteriores.forEach(
      element => {
        const cmmf = {
          proveedor: element.proveedor._id,
          codigo: element.codigo,
        }
        anteriores.push(cmmf)
      }
    )
    const completo = [...anteriores, ...this.cmmfNuevos];
    console.log({Anteriores: anteriores, Nuevos: this.cmmfNuevos, completo});

    this.apiService.peticionesPut(`productos/cmmf/${this.productoId}`, {cmmf: completo})
      .subscribe(
        (data: any) => {
          swal(':D', 'CMMF Agregados', 'success')
        }
      )
  }

}
