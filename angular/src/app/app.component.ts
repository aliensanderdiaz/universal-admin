import { Component } from '@angular/core';
import swal from 'sweetalert';
import { CartService } from './servicios/cart.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // mostrar = false;
  mostrarMenu = false;
  constructor(
    public cartService: CartService
  ) {}

  swalexample() {
    swal('Hello world!');
  }
}
