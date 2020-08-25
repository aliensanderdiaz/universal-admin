import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/servicios/api.service';

@Component({
  selector: 'app-clientes-nit',
  templateUrl: './clientes-nit.component.html',
  styleUrls: ['./clientes-nit.component.css']
})
export class ClientesNitComponent implements OnInit {

  clientes: any[] = [];

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.cargarClientes();
  }

  cargarClientes() {
    this.apiService.peticionGet(`clientes?tipoId=nit`)
      .subscribe((data: any) => {
        this.clientes = data.usuarios;
        // const CLIENTES = data.usuarios;
        // this.clientes = CLIENTES.filter(element => element.numeroId.length === 9)
        console.log('ya hay clientes');
        
      });
  }

  editarCliente(cliente) {
    console.log({cliente});
    const CLIENTE = {
      primerNombre: cliente.primerNombre.trim(),
      segundoNombre: cliente.segundoNombre.trim(),
      apellidos: cliente.apellidos.trim(),
      telefono: cliente.telefono.trim(),
      direccion: cliente.direccion.trim(),
      ciudad: cliente.ciudad.trim(),
      departamento: cliente.departamento.trim()
    }

    this.apiService.peticionesPut(`usuarios/${cliente._id}`, CLIENTE).subscribe((data: any) => {
      swal('Muy Bien', 'Usuario editado correctamente', 'success');
    });
  }

  cambiarANIT() {
    this.clientes.forEach(element => {
      this.apiService.peticionesPut(`usuarios/${element._id}`, {tipoId: 'nit'}).subscribe((data: any) => {
        console.log(element.razonSocial);
      });
    })
  }

}
