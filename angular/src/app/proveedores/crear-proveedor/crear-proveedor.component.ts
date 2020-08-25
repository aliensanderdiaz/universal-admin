import { ApiService } from './../../servicios/api.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-crear-proveedor',
  templateUrl: './crear-proveedor.component.html',
  styleUrls: ['./crear-proveedor.component.css']
})
export class CrearProveedorComponent implements OnInit {

  nombre: string;
  tipoId: string;
  numeroId: number;
  ciudad: string;
  direccion: string;
  telefono: number;

 constructor(
   private apiService: ApiService
 ) { }

  ngOnInit() {
  }

  crearProveedor(form: NgForm) {
    const formValues = Object.assign({}, form.value);
    const formKeys = Object.keys(formValues);
    console.log(formValues);
    console.log(formKeys);

    for (let i = 0; i < formKeys.length; i++) {
      if (!formValues[formKeys[i]]) {
        console.log(formKeys[i]);
        swal(':(', 'Valores no definidos en el formulario', 'warning');
        return;
      }
    }

    console.log('Todo va bien');

    this.apiService.peticionesPost('proveedores', formValues)
      .subscribe((data: any) => {
        swal('Muy Bien', 'Proveedor creado correctamente', 'success');
        console.log(data);
      });
  }

}
