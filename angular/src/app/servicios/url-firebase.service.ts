import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlFirebaseService {

  urlFirebase: Array<string> = [];

  constructor() { }

  agregarUrl(url) {
    this.urlFirebase.push(url);
  }

  obtenerUrls() {
    return this.urlFirebase;
  }

  resetear() {
    return this.urlFirebase = [];
  }
}
