import { Component, OnInit } from '@angular/core';
import { ApiService } from '../servicios/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hermandades',
  templateUrl: './hermandades.component.html',
  styleUrls: ['./hermandades.component.css']
})
export class HermandadesComponent implements OnInit {

  hermandades: any[] = [];

  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit() {
    this.cargarHermandades();
  }

  cargarHermandades() {
    this.apiService.peticionGet('hermandad')
      .subscribe((data: any) => {
        this.hermandades = data.hermandades;
      })
  }

  irAHermandad(id) {
    this.router.navigate(['/hermandades/editar-hermandad', id]);
  }

  irAHermandadVer(id) {
    this.router.navigate(['/hermandades/hermandad', id]);
  }

}
