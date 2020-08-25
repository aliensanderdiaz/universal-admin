import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { BusquedaProductosService } from '../../servicios/busqueda-productos.service';
import { ApiService } from '../../servicios/api.service';

import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { BusquedaClientesService } from '../../servicios/busqueda-clientes.service';

@Component({
  selector: 'app-crear-venta',
  templateUrl: './crear-venta.component.html',
  styleUrls: ['./crear-venta.component.css']
})
export class CrearVentaComponent implements OnInit, AfterViewInit {

  @ViewChild('searchSup') searchSup;
  @ViewChild('searchProd') searchProd;

  Math: any;

  hoy: Date = new Date();

  // suppliers: Array<any>;

  clientesEncontrados: Array<any> = [];
  clienteElegido: any;

  productosEncontrados: Array<any> = [];
  productoElegido: any;

  productosElegidos: Array<any> = [];
  idProductosElegidos: Array<any> = [];

  grossTotal: number = 0;
  discounts: number = 0;
  subtotal: number = 0;
  iva: number = 0;
  total: number = 0;

  invoice: any = {
    total: this.total
  };

  // values
  productSearch: string;

  // ValoresGuardar
  fechaFactura: any;
  numeroFactura: any;


  constructor(
    public busquedaProductosService: BusquedaProductosService,
    public busquedaClientesService: BusquedaClientesService,
    public _apiService: ApiService
  ) {
    this.Math = Math;
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.obtenerSuppliers();
    this.obtenerProductos();
  }

  obtenerSuppliers() {
    this.busquedaClientesService.obtenerClientes('usuarios-por-tipo-lista-completa?tipo=cliente');

    fromEvent(this.searchSup.nativeElement, 'keyup')
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        map((event: KeyboardEvent) => (<HTMLInputElement>event.target).value),
        switchMap(title => this.busquedaClientesService.obtenerClientesFiltrados(title)))
      .subscribe((clientes: any) => {
        this.clientesEncontrados = clientes;
      });
  }

  elegirCliente( cliente ) {
    this.clienteElegido = cliente;
  }

  obtenerProductos() {
    this.busquedaProductosService.obtenerProductos('productos-lista-completa');

    fromEvent(this.searchProd.nativeElement, 'keyup')
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        map((event: KeyboardEvent) => (<HTMLInputElement>event.target).value),
        switchMap(title => this.busquedaProductosService.obtenerProductosFiltrados(title)))
    .subscribe((productNames: any) => {
      this.productosEncontrados = productNames;
    });
  }

  elegirProducto( producto ) {

    if (!this.idProductosElegidos.includes(producto._id)) {
      const product = {
        productoId: producto._id,
        productName: producto.nombre,
        qty: 1,
        unitValue: producto.caracteristicas.precio,
        valorVenta: 0,
        valorTotal: 0
      };
      // console.log(product);
      this.actualizar('e');

      this.productosElegidos[this.productosElegidos.length] = product;

      this.idProductosElegidos.push(product.productoId);
      this.productSearch = '';
      this.productosEncontrados = [];
      console.log(this.productosElegidos);
    }

  }

  trackByProductId(index: number, product: any): number {
    return index;
  }



  eliminarProducto( i ) {
    this.productosElegidos.splice(i, 1);
    this.idProductosElegidos.splice(i, 1);
    this.actualizar(i);
  }

  actualizar(e) {
    let _total = 0;

    for ( const product of this.productosElegidos ) {
      _total += product.qty * product.valorVenta;
    }

    this.total = Math.round(_total);
    this.subtotal = Math.round(this.total / 1.19);
    this.iva = Math.round(this.total - this.subtotal);
  }

  prueba() {
    console.log('Fecha de Factura', this.hoy);
    console.log('Cliente', this.clienteElegido._id);


    const productosEnVenta = [];

    this.productosElegidos.forEach( (element: any) => {
      const productoEnVenta = {
        productoId: element.productoId,
        cantidad: element.qty,
        valorFijo: element.unitValue,
        valorVenta: element.valorVenta,
        valorTotal: Math.round(element.qty * element.valorVenta)
      };
      productosEnVenta.push(productoEnVenta);
    });

    console.log('products', productosEnVenta);
    console.log('subtotal', this.subtotal);
    console.log('iva', this.iva);
    console.log('total', this.total);

    const venta = {
      // fechaFactura: this.hoy,
      clienteId: this.clienteElegido._id,
      // numeroDeFactura: this.numeroFactura,
      productos: productosEnVenta,
      subtotal: this.subtotal,
      iva: this.iva,
      total: this.total
    };

    console.log(venta);

    this._apiService.peticionesPost('ventas', venta)
      .subscribe( (data: any) => {
        swal('Venta', 'Creada con Exito', 'success');
      });


  }
}
