import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../servicios/api.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.css']
})
export class CrearUsuarioComponent implements OnInit {

  primerNombre: string;
  segundoNombre: string;
  apellidos: string;
  tipoId: string = 'cc';
  numeroId: string;
  ciudad: string = 'Neiva';
  departamento: string = 'Huila';
  direccion: string;
  tipo: string = 'cliente';
  telefono: string;

  usuarioEncontrado: boolean = true;

 constructor(
   private apiService: ApiService,
   private router: Router
 ) { }

  ngOnInit() {
  }

  crearProveedor(form: NgForm) {
    const formValues = Object.assign({}, form.value);
    const formKeys = Object.keys(formValues);
    console.log(formValues);
    console.log(formKeys);

    for (let i = 0; i < formKeys.length; i++) {
      if (!formValues[formKeys[i]] && formKeys[i] != 'segundoNombre') {
        console.log(formKeys[i]);
        swal(':(', 'Valores no definidos en el formulario', 'warning');
        return;
      }
    }

    console.log('Todo va bien');

    this.apiService.peticionesPost('usuarios', formValues)
      .subscribe((data: any) => {
        swal('Muy Bien', 'Usuario creado correctamente', 'success');
        // this.router.navigate(['/usuarios', 'usuario', data.usuario._id ])
        this.reset();
        console.log(data);
      });
  }

  reset() {
    this.primerNombre = '';
    this.segundoNombre = '';
    this.apellidos = '';
    this.tipoId = 'cc';
    this.numeroId = '';
    this.ciudad = 'Neiva';
    this.departamento = 'Huila';
    this.direccion = '';
    this.tipo = 'cliente';
    this.telefono = '';

    this.usuarioEncontrado = true;
  }

  buscarUsuario() {
    if (!this.numeroId || this.numeroId.length < 6) {
      swal(':(', 'Número muy corto', 'error');
      return;
    }

    this.apiService.peticionGet(`usuarios/usuario-por-numero/${this.numeroId}`)
      .subscribe((data: any) => {
        swal(':(', 'Ya existe este usuario', 'error');
        console.log(data);
      }, (error) => {
        console.log('{ error }');
        console.log({ error });
        this.usuarioEncontrado = false;
        console.log('{ error }');
      })


  }

}
