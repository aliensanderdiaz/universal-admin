import { ApiService } from './../../../servicios/api.service';
import { UrlFirebaseService } from './../../../servicios/url-firebase.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireStorage } from 'angularfire2/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-agregar-descripcion',
  templateUrl: './agregar-descripcion.component.html',
  styleUrls: ['./agregar-descripcion.component.css']
})
export class AgregarDescripcionComponent implements OnInit {

  texto: string;
  alineacion: string;

  coleccion: any[] = [];

  productoId: string;

  downloadURL: Observable<string>;
  urlImage: string;

  descripcionPoducto: any;
  cantidad: number;

  constructor(
    private route: ActivatedRoute,
    public servicioURL: UrlFirebaseService,
    private apiService: ApiService,
    private storage: AngularFireStorage
  ) { }

  ngOnInit() {
    this.productoId = this.route.snapshot.params.id;
    this.traerDescripcion();
  }

  traerDescripcion() {
    this.apiService.peticionGet('productos/' + this.productoId)
      .subscribe((data: any) => {
        this.descripcionPoducto = data.producto.descripcion;
        this.cantidad = data.producto.descripcion.length;
        console.log(this.descripcionPoducto);
      });
  }

  agregarDescripcion() {

    if (!this.alineacion || !this.texto || !this.urlImage) {
      swal(':(', 'Faltan condiciones para agregar la descripción al producto', 'error');
      return;
    }

    const descripcion = {
      alineacion: this.alineacion,
      texto: this.texto,
      imagen: this.urlImage
    };

    this.descripcionPoducto.push(descripcion);

    console.log(descripcion);
    this.alineacion = '';
    this.texto = '';
    this.urlImage = '';
  }

  grabarEnDb() {
    console.log('this.descripcionPoducto');
    console.log(this.descripcionPoducto);
    console.log('this.descripcionPoducto');
    this.apiService.peticionesPut('productos/agregar-descripcion/' + this.productoId, this.descripcionPoducto)
      .subscribe((data: any) => {
        swal('Muy Bien', 'Descripción agregada con éxito', 'success');
        this.servicioURL.resetear();
        this.coleccion = [];
      });
  }

  loadImages(event) {
    this.coleccion = event.target.files;
    console.log(this.coleccion);
    console.log(event.target.files[0].name);
    if (event.target.files[0].name.startsWith('descripcion@')) {
      const imageName = event.target.files[0].name;
      const file = event.target.files[0];
      const filePath = `${this.productoId}/${imageName}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);
      // get notified when the download URL is available
      task.snapshotChanges().pipe(
          finalize(() => {
            this.downloadURL = fileRef.getDownloadURL();
            this.downloadURL.subscribe(value => this.urlImage = value );
          })
       )
      .subscribe();
    } else {
      swal(':(', 'La imagen no cumple la condición dada', 'error');
      return;
    }
  }

}
