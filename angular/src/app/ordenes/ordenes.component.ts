import { Component, OnInit } from '@angular/core';
import { ApiService } from '../servicios/api.service';

@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.component.html',
  styleUrls: ['./ordenes.component.css']
})
export class OrdenesComponent implements OnInit {

  ordenes: any[] = [];
  totalOrdenes: number = 0;

  ordenElegida: any;

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.cargarOrdenes();
  }

  copyMessage(...args){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = args.join(' ').trim();
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  cargarOrdenes() {
    this.apiService.peticionGet('ordenes-pos')
      .subscribe((data: any) => {
        this.ordenes = data.ventas;
        this.totalOrdenes = data.total;
        console.log({data});

      });
  }

  elegirOrden(indice) {
    this.ordenElegida = this.ordenes[indice];
    console.log({ orden: this.ordenElegida });
  }

  modificarOrden(ordenId, etiqueta) {
    const INDICE = this.ordenes.find(element => element._id === ordenId);
    if(!etiqueta) {
      this.apiService.peticionesDelete(`ordenes-pos/${ordenId}`)
        .subscribe((data: any) => {
          this.ordenElegida = undefined;
          this.ordenes.splice(INDICE, 1);
          this.totalOrdenes = this.ordenes.length;
        })
    } else {
      const ETIQUETA = {
        etiqueta
      }
      this.apiService.peticionesPut(`ordenes-pos/${ordenId}`, ETIQUETA)
        .subscribe((data: any) => {
          this.ordenElegida = undefined;
          this.ordenes.splice(INDICE, 1);
          this.totalOrdenes = this.ordenes.length;
        })
    }
  }

  crearFacturaPos() {

    console.log('Crear Factura Pos');
    console.log({ ordenElegida: this.ordenElegida });

    const FACTURA = {
      ordenId: this.ordenElegida._id,
      cliente: this.ordenElegida.cliente._id,
      vendedor: this.ordenElegida.vendedor._id,
      productos: this.ordenElegida.productos.map(elemento => {
        return {
          producto: elemento.producto._id,
            cantidad: +elemento.cantidad,
            valorUnidad: +elemento.valorVenta,
            valorNeto: +( (+elemento.cantidad) * (+elemento.valorVenta) / (1 + elemento.producto.impuesto.tarifa * 0.01 ) ).toFixed(2),
            impuesto: +((+elemento.cantidad) * (+elemento.valorVenta) - ( (+elemento.cantidad) * (+elemento.valorVenta) / (1 + elemento.producto.impuesto.tarifa * 0.01 ) )).toFixed(2),
            valorTotal: (+elemento.cantidad) * (+elemento.valorVenta)
        };
      }),
      total: this.calcularTotal(),
      subtotal: this.calcularSubtotal()
    };

    console.log({ FACTURA });

    this.apiService.peticionesPost('pos', FACTURA)
      .subscribe(
        (data: any) => {
          console.log({ data });
          this.ordenes.splice(this.ordenes.findIndex(orden => orden._id === this.ordenElegida._id), 1);
          this.ordenElegida = null;
          this.totalOrdenes--;
        },
        (error: any) => {
          console.log({ error });
        },
        () => {

        },
      );

  }

  crearFacturaElectronica() {
    console.log('Crear Factura Electronica');
    console.log({ ordenElegida: this.ordenElegida });
  }

  calcularSubtotal() {
    let SUBTOTAL = 0;

    this.ordenElegida.productos.forEach(
      ( producto: any) => {
        SUBTOTAL += (+( (+producto.cantidad) * (+producto.valorVenta) / (1 + producto.producto.impuesto.tarifa * 0.01 ) ).toFixed(2));
      }
    );

    return SUBTOTAL;
  }

  calcularTotal() {
    let TOTAL = 0;

    this.ordenElegida.productos.forEach(
      ( producto: any) => {
        TOTAL += ((+producto.cantidad) * (+producto.valorVenta));
      }
    );

    return TOTAL;
  }

}
