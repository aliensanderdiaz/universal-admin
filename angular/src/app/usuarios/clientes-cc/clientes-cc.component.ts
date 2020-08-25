import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/servicios/api.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-clientes-cc',
  templateUrl: './clientes-cc.component.html',
  styleUrls: ['./clientes-cc.component.css']
})
export class ClientesCcComponent implements OnInit {

  clientes: any[] = [];

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.cargarClientes();
  }

  cargarClientes() {
    this.apiService.peticionGet(`clientes`)
      .subscribe((data: any) => {
        // this.clientes = data.usuarios;
        const CLIENTES = data.usuarios;
        CLIENTES.forEach(element => {
          element.numeroId = parseInt(element.numeroId, 10);
        });

        CLIENTES.sort((a,b) => a.numeroId - b.numeroId);

        this.clientes = CLIENTES;
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

}
