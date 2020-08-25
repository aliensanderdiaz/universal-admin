import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../servicios/api.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-compra',
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.css']
})
export class CompraComponent implements OnInit {

  postId: string;
  url: string;

  invoice: any;

  constructor(
    private route: ActivatedRoute,
    public _apiService: ApiService
  ) {
    route.params.subscribe(
      params => {
        this.postId = params['id'];
      }
    );

    this.url = 'compras/' + this.postId;

    this._apiService.peticionGet( this.url )
      .subscribe( (data: any) => {
        this.invoice = data.invoice;
        console.log(this.invoice);
      });
  }

  ngOnInit() {
  }

  ejecutarHistorico(invoiceId) {
    if (!this.invoice.completada) {
      swal('ADVERTENCIA', 'No puedes realizar esta acción si no has indicado que la factura de compra esta completa', 'warning');
    }
    const url = 'inventarios/ejecutar-historico/' + invoiceId;
    this._apiService.peticionGet( url )
      .subscribe( (data: any) => {
        console.log(data);
      });

    swal('MUY BIEN', 'SE PUEDE EJECUTAR EL HISTORICO', 'success');
  }

  facturaCompletada(invoiceId) {
    this._apiService.peticionesPost( `factura-completada/${ invoiceId }`, {} )
      .subscribe( (data: any) => {
        console.log(data);
        swal('MUY BIEN', 'LA FACTURA AHORA ESTÁ COMPLETADA', 'success');
      });
  }
}
