import { ColoresService } from './../../servicios/colores.service';
import { BusquedaProveedoresService } from './../../servicios/busqueda-proveedores.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../servicios/api.service';
import { BusquedaService } from '../../servicios/busqueda-categorias.service';

import { fromEvent } from 'rxjs';
import { map, switchMap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { FuncionesService } from '../../servicios/funciones.service';
import { NgForm } from '@angular/forms';
import { UrlFirebaseService } from '../../servicios/url-firebase.service';
import { Router } from '@angular/router';
import swal from 'sweetalert';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.css']
})
export class CrearProductoComponent implements OnInit {

  @ViewChild('inputCategoria') inputCategoria;
  @ViewChild('inputProveedor') inputProveedor;

  referenciaBuscar: string;
  referenciaExiste: boolean = true;

  colores: any[] = [];

  productoId: string;

  caracteristicas: any[] = [
    ['Modelo', 'text'],
    ['Precio', 'number'],
    ['Existencias', 'number'],
    ['Color', 'text'],
    // ['Referencia', 'text'],
    ['Garantía', 'text'],
    // ['Código de Barras', 'text'],
    ['EAN13', 'text'],
    ['EAN14', 'text'],
  ];

  cmmfs: any[] = [];
  cmmfProveedores: any[] = [];

  caracteristicasSlug: string[] = [];

  pagina: number = 1;
  nombre: string;
  etiqueta: string = 'Repuesto';
  etiquetas: string[] = ['Producto', 'Repuesto', 'Combo'];
  marca: any;
  categoria: any = {
    nombre: ''
  };
  categoriaParent: any;
  categoriaParentConDetalles: any;


  marcas: any[] = [];
  categorias: any[] = [];
  categoriasFiltradas: any[] = [];

  proveedoresFiltrados: any[] = [];

  buscarCategoria: boolean = false;

  proveedorElegido: any = {
    nombre: ''
  };
  cmmf: string;

  coleccion = [];

  pp: number = 1;

  videoUrls: any[] = [];
  videoUrl: string;

  existeParent: boolean = false;

  constructor(
    private apiService: ApiService,
    private busquedaService: BusquedaService,
    private funcionesService: FuncionesService,
    public servicioURL: UrlFirebaseService,
    private busquedaProveedoresService: BusquedaProveedoresService,
    private router: Router,
    private coloresService: ColoresService
  ) { }

  ngOnInit() {
    this.cargarMarcas();
    this.convertirCaracteristicas();
    this.colores = this.coloresService.obtenerColores();
  }

  testTipo() {
    console.log({Tipo: this.etiqueta})
  }

  verificarReferencia() {
    console.log(this.referenciaBuscar);
    if (this.referenciaBuscar === '' || this.referenciaBuscar === null || this.referenciaBuscar === undefined) {
      return;
    }
    this.apiService.peticionGet(`productos/referencia/${this.referenciaBuscar}`)
      .subscribe((data: any) => {
        console.log(data.productos.length);
        if (data.productos.length === 0) {
          console.log('No hay productos');
          this.referenciaExiste = false;
        } else {
          swal(':(', `Ya existe un producto en la base de datos con esa referencia ${this.referenciaBuscar}`, 'warning');
        }
      });
  }

  elegir(event) {
    this.pp = event + 1;
  }

  convertirCaracteristicas() {
    this.caracteristicasSlug = this.caracteristicas.map(element => this.funcionesService.stringToSlug(element[0]));
    // console.log(this.caracteristicasSlug);
  }

  cambiarPagina( valor ) {
    this.pagina = valor;
  }

  cargarMarcas() {
    this.apiService.peticionGet('marcas-lista-completa')
      .subscribe((data: any) => {
        this.marcas = data.marcas;
        // console.log(this.marcas);
      });
  }

  cargarCategorias() {
    this.apiService.peticionGet('categorias-lista-completa')
      .subscribe((data: any) => {
        this.categorias = data.categorias;
      });

      this.busquedaService.obtenerCategorias('crear-arbol-parent');

      fromEvent(this.inputCategoria.nativeElement, 'keyup').pipe(debounceTime(400)
      , distinctUntilChanged()
      , map((event: KeyboardEvent) => (<HTMLInputElement>event.target).value)
      , switchMap(title => this.busquedaService.obtenerCategoriasFiltradas(title)))
      .subscribe((categories: any) => {
        this.categoriasFiltradas = categories;
        console.log({categoriasFiltradas: this.categoriasFiltradas});
      });

  }

  async elegirCategoria(categoria) {
    console.log(`Categoría En : ${categoria.nombre}`);
    this.categoria = categoria;
    console.log('####this.categoria');
    console.log(this.categoria);
    console.log('####this.categoria');
    this.buscarCategoria = false;
    // this.categoriaParent = this.categorias.find( element => element._id === this.categoria.parent._id);

    // do {
    //   const data: any = await this.apiService.peticionGet(`categorias/${this.categoriaParent._id}`).toPromise();

    //       if (data.categoria.detalles.length > 0) {
    //         this.existeParent = true;
    //       } else {
    //         this.categoriaParent = data.categoria;
    //       }

    // } while (!this.existeParent);

    console.log(`Categoría Elegida: ${this.categoria.nombre}`);
    // console.log(`Categoría Padre Elegida: ${this.categoriaParent.nombre}`);

    this.apiService.peticionGet(`categorias/${this.categoria._id}`)
      .subscribe((data: any) => {
        this.categoriaParentConDetalles = data.categoria;
        console.log({categoriaPArentConDetalles: this.categoriaParentConDetalles});
      });
  }

  encontrarParent() {

  }

  buscarCategorias() {
    this.buscarCategoria = true;
    this.cargarCategorias();
  }

  crearProducto(form: NgForm) {

    const formValues = Object.assign({}, form.value);
    const producto = {
      nombre: this.nombre,
      etiqueta: this.etiqueta,
      slug: this.funcionesService.stringToSlug(this.nombre),
      marca: this.marca,
      categoria: this.categoria._id,
      // categoria_padre: this.categoriaParent._id,
      caracteristicas: {
        referencia: this.referenciaBuscar
      },
      detalles: {},
      pp: this.pp,
      pictures: this.servicioURL.obtenerUrls(),
      videos: this.videoUrls,
      cmmf: this.cmmfs
    };
    // Features
    this.caracteristicasSlug.forEach(element => {
      producto.caracteristicas[element] = formValues[element];
    });

    // specifics
    this.categoriaParentConDetalles.detalles.forEach(element => {
      // if (element[3]) {
      //   const elementA = element[1] + '_A';
      //   const elementB = element[1] + '_B';
      //   producto.detalles[element[1]] = formValues[elementA] + ' ' + formValues[elementB];
      // } else {
        producto.detalles[element[1]] = formValues[element[1]];
      // }
    });


    // console.log('formValues');
    // console.log(formValues);
    // console.log('formValues');
    console.log('producto');
    console.log(producto);
    console.log('producto');
    this.apiService.peticionesPost('productos', producto)
      .subscribe((data: any) => {
        this.productoId = data.producto._id;
        swal(`Muy bien`, `Producto con Id ${this.productoId} creado`, 'success');
        this.router.navigate([`/productos/producto/${this.productoId}`]);
      });
  }

  imprimirCategoria() {
    console.log(this.categoriaParent.detalles);
  }

  loadImages(event) {
    this.coleccion = event.target.files;
    console.log(this.coleccion);
  }

  agregarImagenes() {
    const body = {
      pp: this.pp,
      pictures: this.servicioURL.obtenerUrls()
    };
  }

  crearArrayImagenes() {
    const picturesLarge = this.servicioURL.urlFirebase;
    const pictures = {
      pp: this.pp,
      large: picturesLarge,
      medium: [],
      small: []
    };

    for (const picture of picturesLarge) {
      const url2 = picture.split('?')[0];
      const urlThumbnail = url2.split('%2F')[0] + '%2Fthumb%40100_' + url2.split('%2F')[1];
      const urlThumbnail2 = url2.split('%2F')[0] + '%2Fthumb%40300_' + url2.split('%2F')[1];


      pictures.small.push(urlThumbnail + '?alt=media');
      pictures.medium.push(urlThumbnail2 + '?alt=media');
    }

    console.log(pictures);

    this.apiService.peticionesPut(`productos/${this.productoId}`, pictures )
      .subscribe((data: any) => {
        swal('Bien', 'Actualizada', 'success');
        this.servicioURL.resetear();
        this.coleccion = [];
      });
  }

  agregarVideo() {
    if (!this.videoUrl) {
      swal(':(', 'No has escrito ninguna url', 'error');
      return;
    }
    this.videoUrls.push(this.videoUrl);
    this.videoUrl = '';
  }

  cargarProveedores() {
    if (this.busquedaProveedoresService.listaProveedores = []) {
      this.busquedaProveedoresService.obtenerProveedores('usuarios-por-tipo-lista-completa?tipo=proveedor');
    }

    fromEvent(this.inputProveedor.nativeElement, 'keyup').pipe(debounceTime(400)
      , distinctUntilChanged()
      , map((event: KeyboardEvent) => (<HTMLInputElement>event.target).value)
      , switchMap(title => this.busquedaProveedoresService.obtenerProveedoresFiltrados(title)))
      .subscribe((provedores: any) => {
        this.proveedoresFiltrados = provedores;
        console.log(this.proveedoresFiltrados);
      });
  }

  elegirProveedor(proveedor) {
    this.proveedorElegido = proveedor;
    this.inputProveedor.nativeElement.focus();
    this.inputProveedor.nativeElement.value = '';
    this.proveedoresFiltrados = [];
  }

  guardarCmmf() {
    console.log('Guardar cmmf', this.proveedorElegido.nombre.length, this.cmmf);
    if (!this.proveedorElegido.nombre || !this.cmmf) {
      swal(':(', 'Imposible añadir CMMF', 'error');
    }
    const cmmfUnit = {
      proveedor: this.proveedorElegido._id,
      codigo: this.cmmf,
    };
    this.cmmfs.push(cmmfUnit);
    this.cmmfProveedores.push(this.proveedorElegido.nombre);
    this.cmmf = '';
    this.proveedorElegido = {
      nombre: ''
    };
  }

}
