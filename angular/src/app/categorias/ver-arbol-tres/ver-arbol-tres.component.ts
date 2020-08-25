import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/servicios/api.service';

@Component({
  selector: 'app-ver-arbol-tres',
  templateUrl: './ver-arbol-tres.component.html',
  styleUrls: ['./ver-arbol-tres.component.css']
})
export class VerArbolTresComponent implements OnInit {

  categorias: any[] = [];
  categorias2: any[] = [];

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.apiService.peticionGet('crear-arbol-sin-rya')
      .subscribe((data: any) => {
        this.categorias = data;
        const CATEGORIAS = this.categorias.filter(element => element.nombre != 'Repuestos y Accesorios')
        const indexed_nodes = {};
        const tree_roots = [];
        CATEGORIAS.forEach(element => {
          element.children = [];
          indexed_nodes[element._id] = element;
        })
        console.log({categorias: CATEGORIAS});
        
        CATEGORIAS.forEach(element => {
          const parent = element.parent;
          if (parent === undefined) {
              tree_roots.push(element);
          } else {
            if (!indexed_nodes[parent]) {

            } else {
              indexed_nodes[parent].children.push(element);
            }
          }
        })
        this.categorias2 = tree_roots;
      })
  }

}
