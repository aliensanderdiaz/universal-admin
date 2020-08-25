import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../servicios/api.service';

@Component({
  selector: 'app-ver-arbol-dos',
  templateUrl: './ver-arbol-dos.component.html',
  styleUrls: ['./ver-arbol-dos.component.css']
})
export class VerArbolDosComponent implements OnInit {

  arbol: any[];

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.cargarArbol();
  }

  cargarArbol() {
    this.apiService.peticionGet('crear-arbol-2')
      .subscribe((data: any) => {
        this.arbol = data;
      });
  }

}
