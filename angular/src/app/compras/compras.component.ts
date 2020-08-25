import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../servicios/api.service';
import { BusquedaProveedoresService } from '../servicios/busqueda-proveedores.service';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent implements OnInit {

  @ViewChild('searchSup') searchSup;

  invoices: Array<any>;
  // desde: any = new Date(2000,1,1);
  // hasta: any = Date.now();
  desde: any = '2000-01-01';
  hasta: any = '2030-01-01';

  total: number = 0;

  proveedoresEncontrados: Array<any> = [];
  proveedorElegido: any;

  constructor(
    public _apiService: ApiService,
    public busquedaProvedoresService: BusquedaProveedoresService
  ) { }

  ngOnInit() {
    this.loadInvoices();
    this.obtenerSuppliers();
  }

  obtenerSuppliers() {
    this.busquedaProvedoresService.obtenerProveedores('usuarios-por-tipo-lista-completa?tipo=proveedor');

    fromEvent(this.searchSup.nativeElement, 'keyup')
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        map((event: KeyboardEvent) => (<HTMLInputElement>event.target).value),
        switchMap(title => this.busquedaProvedoresService.obtenerProveedoresFiltrados(title)))
      .subscribe((suppliers: any) => {
        console.log('Evento de Teclado... Busqueda Proveedor...');

        this.proveedoresEncontrados = suppliers;
      });
  }

  elegirProveedor(supplier) {
    console.log({ supplier });

    this.proveedorElegido = supplier;
  }

  loadInvoices() {
    this._apiService.peticionGet('compras')
    .subscribe( (data: any) => {
      this.invoices = data.invoices;
      console.log(this.invoices);
      this.calcularTotal();
    });
  }

  deleteInvoice( invoiceId ) {
    // this._apiService.peticionesDELETE('/invoices/' + invoiceId )
    //   .subscribe( (data: any) => {
    //     swal('Ok', 'Producto Eliminado con Exito', 'success');
    //     this.loadInvoices();
    //   });
  }

  filtrarCompras() {
    console.log({desde: this.desde, hasta: this.hasta});

    if (this.proveedorElegido) {
      this._apiService.peticionGet(`compras-filtradas-proveedor?desde=${this.desde}&hasta=${this.hasta}&proveedorId=${this.proveedorElegido._id}`)
        .subscribe( (data: any) => {
          this.invoices = data.invoices;
          console.log(this.invoices);
          this.calcularTotal();
        });
    } else {
      this._apiService.peticionGet(`compras-filtradas?desde=${this.desde}&hasta=${this.hasta}`)
        .subscribe( (data: any) => {
          this.invoices = data.invoices;
          console.log(this.invoices);
          this.calcularTotal();
        });
    }

  }

  calcularTotal() {
    let total = 0;
    this.invoices.forEach(
      invoice => total += invoice.total
    )
    this.total = total;
  }

}
