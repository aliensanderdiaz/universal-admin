import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../servicios/api.service';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {

  categoriaId: string;
  categoria: any;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.encontrarId();
  }

  encontrarId() {
    this.categoriaId = this.route.snapshot.params.id;
    this.cargarCategoria();
  }

  cargarCategoria() {
    this.apiService.peticionGet(`categorias/${this.categoriaId}`)
      .subscribe((data: any) => {
        this.categoria = data.categoria;
        console.log(this.categoria);
      });
  }

}
