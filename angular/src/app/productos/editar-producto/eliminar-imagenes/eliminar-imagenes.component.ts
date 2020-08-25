import { ApiService } from './../../../servicios/api.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from 'angularfire2/storage';

@Component({
  selector: 'app-eliminar-imagenes',
  templateUrl: './eliminar-imagenes.component.html',
  styleUrls: ['./eliminar-imagenes.component.css']
})
export class EliminarImagenesComponent implements OnInit {

  productoId: string;
  pictures: any;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private storage: AngularFireStorage
  ) { }

  ngOnInit() {
    this.conocerId();
  }

  conocerId() {
    this.productoId = this.route.snapshot.params.id;
    this.cargarImagenes();
  }

  cargarImagenes() {
    this.apiService.peticionGet(`productos/${this.productoId}`)
      .subscribe(
        (data: any) => {
          this.pictures = data.producto.pictures;
          console.log(this.pictures);
        }
      );
  }

  eliminarImagen(imagen: string, indice: number) {
    console.log(imagen);
    console.log(imagen.includes('thumb%40100_'));
    const ref = imagen.split('appspot.com/o/')[1].split('?alt=')[0];
    const newRef = ref.replace('%2F', '/');
    const newRef2 = newRef.replace('%40', '@');
    console.log(ref);
    console.log(newRef);
    console.log(newRef2);
    const refArray = [ newRef2, newRef2.replace('thumb@100_', ''), newRef2.replace('thumb@100_', 'thumb@300_') ];

    refArray.forEach((element) => {
      const desertRef = this.storage.ref(element);
      desertRef.delete();
    });

    this.pictures.large.splice(indice, 1);
    this.pictures.small.splice(indice, 1);
    this.pictures.medium.splice(indice, 1);

    // // Create a reference to the file to delete
    // const desertRef = this.storage.ref(newRef2);
    // // Delete the file
    // desertRef.delete();

    const pictures = {
      pp: 1,
      large: this.pictures.large,
      medium: this.pictures.medium,
      small: this.pictures.small
    };

    if (indice >= this.pictures.pp || this.pictures.pp === 1 ) {
      console.log('primera condición');
      console.log(indice, this.pictures.pp);
      pictures.pp = this.pictures.pp;
    } else {
      console.log(indice, this.pictures.pp);
      console.log('segunda condición');
      pictures.pp = this.pictures.pp - 1;
    }

    console.log(pictures);

    this.apiService.peticionesPut(`productos/${this.productoId}`, pictures )
      .subscribe((data: any) => {
        swal('Bien', 'Actualizada', 'success');
      });
  }

}
