import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  urlApi: string = environment.urlApi;

  constructor( private http: HttpClient) { }

  peticionGet( url: string ) {
    return this.http.get( this.urlApi + url );
  }

  peticionesPost( url: string, body: any ) {
    return this.http.post( this.urlApi + url, body );
  }

  peticionesPut( url: string, body: any ) {
    return this.http.put( this.urlApi + url, body );
  }

  peticionesDelete( url: string ) {
    return this.http.delete( this.urlApi + url );
  }
}
