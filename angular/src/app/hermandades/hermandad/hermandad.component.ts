import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/servicios/api.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-hermandad',
  templateUrl: './hermandad.component.html',
  styleUrls: ['./hermandad.component.css']
})
export class HermandadComponent implements OnInit {

  hermandadId: string;
  hermandad: any;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.cargarHermandad();
  }

  cargarHermandad() {
    this.route.params.subscribe(
      (params: Params) => {
        this.hermandadId = params['id'];

        this.apiService.peticionGet(`hermandad/${this.hermandadId}`)
          .subscribe((data: any) => {
            this.hermandad = data.hermandad;
            console.log(this.hermandad);
            
          })
      }
    )
  }

  hacerFor() {
    const PRODUCTOS = this.hermandad.productos.map(producto => producto.producto._id);

    console.log(PRODUCTOS);

    PRODUCTOS.forEach((producto, index) => {
      // if (index === 1) {
        this.apiService.peticionesPut(`productos-hermandad/${producto}`, { hermandad: this.hermandadId })
          .subscribe((data: any) => console.log('Editado', index))
      // } else {
      //   this.apiService.peticionesPut(`productos-hermandad/${producto}`, { hermandad: false })
      //     .subscribe((data: any) => console.log('Editado', index))
      // }
    });
    
  }

}
