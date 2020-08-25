import { ApiService } from './../../servicios/api.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-marca',
  templateUrl: './marca.component.html',
  styleUrls: ['./marca.component.css']
})
export class MarcaComponent implements OnInit {

  marcaId: string;
  marca: any;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.cargarIdMarca();
  }

  cargarIdMarca() {
    this.marcaId = this.route.snapshot.params.id;
    this.cargarMarca();
  }

  cargarMarca() {
    this.apiService.peticionGet(`marcas/${this.marcaId}`)
      .subscribe((data: any) => {
        this.marca = data.marca;
      });
  }

}
