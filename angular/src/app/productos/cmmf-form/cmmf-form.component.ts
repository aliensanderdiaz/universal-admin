import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { fromEvent } from 'rxjs';
import { map, switchMap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { BusquedaProveedoresService } from 'src/app/servicios/busqueda-proveedores.service';
import swal from 'sweetalert';
import { ApiService } from 'src/app/servicios/api.service';

@Component({
  selector: 'app-cmmf-form',
  templateUrl: './cmmf-form.component.html',
  styleUrls: ['./cmmf-form.component.css']
})
export class CmmfFormComponent implements OnInit {

  @ViewChild('inputProveedor') inputProveedor;

  idProducto: string = '';
  nombreProducto: string = '';
  indice: number = 0;

  cmmf: any[] = [];

  proveedores: any[] = [];
  cargando: boolean = true;

  proveedorTemp: any = {};
  proveedorTempCreado: boolean = false;

  codigoTemp = '';

  constructor(
    public activeModal: NgbActiveModal,
    private busquedaProveedoresService: BusquedaProveedoresService,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.cargarProveedores();
  }

  cargarProveedores() {
    if (this.busquedaProveedoresService.listaProveedores = []) {
      this.busquedaProveedoresService.obtenerProveedores('usuarios-por-tipo-lista-completa?tipo=proveedor');
    }

    this.cargando = false;

    fromEvent(this.inputProveedor.nativeElement, 'keyup').pipe(debounceTime(400)
      , distinctUntilChanged()
      , map((event: KeyboardEvent) => (<HTMLInputElement>event.target).value)
      , switchMap(title => this.busquedaProveedoresService.obtenerProveedoresFiltrados(title)))
      .subscribe((provedores: any) => {
        this.proveedores = provedores;
        console.log(this.proveedores);
      });
  }

  eliminar(i) {
    console.log(this.cmmf[i]);
    this.cmmf.splice(i, 1);
  }

  elegirProveedor(nombre, id) {
    console.log({ nombre, id });
    this.proveedorTemp = { primerNombre: nombre, _id: id }
    this.proveedorTempCreado = true;
    this.proveedores = [];
    this.inputProveedor.nativeElement.value = '';
    this.cargando = true;
  }

  agregarCmmfTemp() {
    if (this.codigoTemp === '') {
      swal(':(', 'Debe haber un código', 'warning');
    }

    else {
      const cmmfTemp = {
        proveedor: this.proveedorTemp,
        codigo: this.codigoTemp
      }

      this.cmmf.push(cmmfTemp);

      this.proveedorTempCreado = false;
      this.proveedorTemp = {};
      this.codigoTemp = '';
      this.cargando = false;
    }
  }

  guardar() {
    const OBJETO_CMMF = this.cmmf.map(
      element => {
        return {
          proveedor: element.proveedor._id,
          codigo: element.codigo
        }
      }
    )

    console.log({
      cmmfPopulado: this.cmmf,
      cmmfObjetoApi: OBJETO_CMMF
    });

    this.apiService.peticionesPut(`productos/cmmf/${this.idProducto}`, {cmmf: OBJETO_CMMF})
      .subscribe(
        (data: any) => {
          swal(':D', 'CMMF Agregados', 'success')
          this.activeModal.dismiss({cmmf: this.cmmf, indice: this.indice})
        }
      )

  }

  otroProveedor() {
    this.cargando = false;
    this.proveedorTemp = {};
    this.cmmf.pop();
    this.proveedorTempCreado = false;
    this.codigoTemp = '';
  }

}
