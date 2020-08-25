import { BusquedaProveedoresService } from './../../servicios/busqueda-proveedores.service';
import { BusquedaProductosService } from './../../servicios/busqueda-productos.service';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ApiService } from '../../servicios/api.service';

import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-compra',
  templateUrl: './crear-compra.component.html',
  styleUrls: ['./crear-compra.component.css']
})
export class CrearCompraComponent implements OnInit, AfterViewInit {

  @ViewChild('searchSup') searchSup;
  @ViewChild('searchProd') searchProd;

  Math: any;

  hoy: Date = new Date();

  // suppliers: Array<any>;

  proveedoresEncontrados: Array<any> = [];
  proveedorElegido: any;

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
  supplierDate: Date;
  supplierNumber: string;

  dueDate: Date;

  paymentMethod: string = 'credito';
  // paymentMethod: string = 'contado';
  
  constructor(
    public busquedaProductosService: BusquedaProductosService,
    public busquedaProvedoresService: BusquedaProveedoresService,
    public _apiService: ApiService,
    public router: Router
  ) {
    this.Math = Math;
  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.obtenerSuppliers();
    this.obtenerProductos();
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

  elegirProducto(producto) {

    console.log({ producto });


    if (!this.idProductosElegidos.includes(producto._id)) {
      const product = {
        productId: producto._id,
        productName: producto.nombre,
        etiqueta: producto.etiqueta,
        qty: 1,
        unitValue: 0,
        discount: 0,
        discount2: 0,
        tax: 19,
        beforeTax: 0,
        withTax: 0,
        withTaxUnit: 0,
        productos: []
      };

      if (producto.combo && producto.combo.length > 0) {
        const productos = [];
        producto.combo.forEach(element => {
          const productoCombo = {
            productId: element._id,
            productName: element.nombre,
            etiqueta: element.etiqueta,
            qty: 1,
            unitValue: 0,
            discount: 0,
            discount2: 0,
            tax: 19,
            beforeTax: 0,
            withTax: 0,
            withTaxUnit: 0
          }

          productos.push(productoCombo);
        })
        product.productos = productos;
      }
      // console.log(product);

      this.productosElegidos[this.productosElegidos.length] = product;

      this.idProductosElegidos.push(product.productId);
      this.productSearch = '';
      this.productosEncontrados = [];
      console.log(this.productosElegidos);
    }

  }

  trackByProductId(index: number, product: any): number {
    return index;
  }



  eliminarProducto(i) {
    this.productosElegidos.splice(i, 1);
    this.idProductosElegidos.splice(i, 1);
    this.actualizar(i);
  }

  actualizar(e) {
    let _grossTotal = 0;
    let _discounts = 0;

    for (const product of this.productosElegidos) {
      _grossTotal += product.qty * product.unitValue;
      _discounts += (product.qty * product.unitValue * (10000 - ((100 - product.discount) * (100 - product.discount2)))) / 10000;
    }

    this.grossTotal = Math.round(_grossTotal);
    this.discounts = Math.round(_discounts);
    this.subtotal = Math.round(this.grossTotal - this.discounts);
    this.iva = Math.round(this.subtotal * 0.19);
    this.total = Math.round(this.subtotal + this.iva);
  }

  prueba() {

    this.actualizar('e');
    console.log('supplierDate', this.supplierDate);
    console.log('supplier', this.proveedorElegido._id);
    console.log('supplierNumber', this.supplierNumber);

    const productsInvoice = [];

    this.productosElegidos.forEach((element: any) => {
      const productInvoice = {
        productId: element.productId,
        qty: element.qty,
        etiqueta: element.etiqueta,
        unitValue: element.unitValue,
        discount: element.discount,
        discount2: element.discount2,
        tax: element.tax,
        // tslint:disable-next-line:max-line-length
        beforeTax: Math.round((element.qty * element.unitValue) * (1 - (element.discount / 100)) * (1 - (element.discount2 / 100))),
        // tslint:disable-next-line:max-line-length
        withTax: Math.round(1.19 * (element.qty * element.unitValue) * (1 - (element.discount / 100)) * (1 - (element.discount2 / 100))),
        // tslint:disable-next-line:max-line-length
        withTaxUnit: Math.round((1.19 * (element.qty * element.unitValue) * (1 - (element.discount / 100)) * (1 - (element.discount2 / 100))) / element.qty),
        productos: []
      };


      if (element.etiqueta === 'Combo' && element.productos && element.productos.length > 0) {
        const productos = [];
        element.productos.forEach(element2 => {

          const productoCombo = {
            productId: element2.productId,
            qty: element2.qty,
            unitValue: element2.unitValue,
            discount: element2.discount,
            discount2: element2.discount2,
            tax: element2.tax,
            // tslint:disable-next-line:max-line-length
            beforeTax: Math.round((element2.qty * element2.unitValue) * (1 - (element2.discount / 100)) * (1 - (element2.discount2 / 100))),
            // tslint:disable-next-line:max-line-length
            withTax: Math.round(1.19 * (element2.qty * element2.unitValue) * (1 - (element2.discount / 100)) * (1 - (element2.discount2 / 100))),
            // tslint:disable-next-line:max-line-length
            withTaxUnit: Math.round((1.19 * (element2.qty * element2.unitValue) * (1 - (element2.discount / 100)) * (1 - (element2.discount2 / 100))) / element2.qty),
          }

          productos.push(productoCombo);

        })

        productInvoice.productos = productos;

      }

      productsInvoice.push(productInvoice);

    });

    

    console.log('products', productsInvoice);
    console.log('grossTotal', this.grossTotal);
    console.log('discounts', this.discounts);
    console.log('subtotal', this.subtotal);
    console.log('iva', this.iva);
    console.log('total', this.total);


    const invoice = {
      supplierDate: this.supplierDate,
      paymentMethod: this.paymentMethod,
      dueDate: undefined,
      // supplierDate: this.supplierDate.getTime() + 1000 * 60 * 60 * 12,
      supplier: this.proveedorElegido._id,
      supplierNumber: this.supplierNumber,
      products: productsInvoice,
      grossTotal: this.grossTotal,
      discounts: this.discounts,
      subtotal: this.subtotal,
      iva: this.iva,
      total: this.total
    };

    console.log(invoice);

    if (this.paymentMethod === 'credito') {
      invoice.dueDate = this.dueDate;
    }

    this._apiService.peticionesPost('compras', invoice)
      .subscribe((data: any) => {
        swal('Compra', 'Creada con Exito', 'success');
        this.router.navigate(['/compras', 'compra', data.compra._id])
      });


  }

}
