import { Component, OnInit, ViewChild, Input, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlFirebaseService } from '../../../servicios/url-firebase.service';
import { AngularFireUploadTask, AngularFireStorage } from 'angularfire2/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-custom-canvas',
  templateUrl: './custom-canvas.component.html',
  styleUrls: ['./custom-canvas.component.css']
})
export class CustomCanvasComponent implements OnInit, AfterViewInit {

  task: AngularFireUploadTask;
  downloadURL: Observable<string>;
  arrayURL: Array<String> = [];

  @ViewChild('myCanvas') miCanvas;

  @Input() image;
  @Input() carpeta;

  imagen: any;

  constructor(
    private storage: AngularFireStorage,
    private servicioURL: UrlFirebaseService
  ) {
    this.arrayURL = this.servicioURL.obtenerUrls();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {

    const canvas = this.miCanvas.nativeElement;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, 450, 500);
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, 450, 500);

    const render = new FileReader();

    render.onload = (event: any) => {

      const img = new Image();
      img.onload = () => {

        const alto = img.height;
        const ancho = img.width;
        const ratio = ancho / alto;
        let x, nuevoancho;
        let y, nuevoalto;

        if (ratio <= 0.9) {
            nuevoancho = Math.floor(ratio * 480);
            x = Math.floor(225 - (nuevoancho / 2));
            context.drawImage(img, x, 10, nuevoancho, 480);
        }

        if (ratio > 0.9) {
            nuevoalto = Math.floor(430 / ratio);
            y = Math.floor(240 - (nuevoalto / 2));
            context.drawImage(img, 10, y, 430, nuevoalto);
        }

        this.imagen = canvas.toDataURL('image/png');

        const date = new Date().getTime();

        const path = `${this.carpeta}/${date}_${this.image.name}`;
        const fileRef = this.storage.ref(path);
        this.task = fileRef.putString(this.imagen, 'data_url');


        this.task.snapshotChanges()
          .pipe(
            finalize(() => {
              this.downloadURL = fileRef.getDownloadURL();
              this.downloadURL.subscribe( value => this.servicioURL.agregarUrl(value));
            })
          )
          .subscribe();


      };

      img.src = event.target.result;
    };

    render.readAsDataURL(this.image);

  }

}
