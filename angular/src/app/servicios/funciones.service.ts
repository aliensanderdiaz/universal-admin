import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FuncionesService {

  constructor() { }

  stringToSlug( valor: string ) {
    const patron = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
    let valorTrans = '';

    valorTrans = valor.toLowerCase();
    valorTrans = valorTrans.replace(/ /gi, '_');
    valorTrans = valorTrans.replace(/ñ/gi, 'n');
    valorTrans = valorTrans.replace(/á/gi, 'a');
    valorTrans = valorTrans.replace(/é/gi, 'e');
    valorTrans = valorTrans.replace(/í/gi, 'i');
    valorTrans = valorTrans.replace(/ó/gi, 'o');
    valorTrans = valorTrans.replace(/ú/gi, 'u');

    return valorTrans;
  }
}
