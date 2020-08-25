import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  fecha: any;
  reporte: any;
  existeReporte: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  verReporte() {
    this.existeReporte = true;
    console.log({ fecha: this.fecha, reporte: this.existeReporte });
  }

}
