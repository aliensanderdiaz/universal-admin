import { BusquedaProductosPorNombreService } from './../servicios/busqueda-productos-por-nombre.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../servicios/api.service';

import { fromEvent } from 'rxjs';
import { map, switchMap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import swal from 'sweetalert';
import { FuncionesService } from '../servicios/funciones.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoriaFormComponent } from './por-marca-categoria/categoria-form/categoria-form.component';
import { CmmfFormComponent } from './cmmf-form/cmmf-form.component';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  @ViewChild('inputProductoPorNombre') inputProductoPorNombre;
  @ViewChild('inputProductoPorModelo') inputProductoPorModelo;
  @ViewChild('inputProductoPorReferencia') inputProductoPorReferencia;
  
  @ViewChild('inputBusqueda') inputBusqueda;

  marcas: any[] = [];

  productosFiltrados: any[] = [];
  cargando: boolean = true;

  desde: number = 0;
  totalProductos: number = 0;

  tipoBusqueda: string = 'referencia'; // Nombre, Referencia, Modelo

  verMarca: boolean = true;
  verReferencia: boolean = true;
  verModelo: boolean = true;
  verCategoria: boolean = false;

  marcaTemp: any = {};

  opciones: any[] = [
    'Marca', 
    'Referencia', 
    'Modelo'
  ];

  otrasOpciones: any[] = [
    'Categoría',
    'EAN13',
    'EAN14',
    'Etiqueta',
    'cmmf'
  ];

  constructor(
    private apiService: ApiService,
    private busquedaProductosPorNombreService: BusquedaProductosPorNombreService,
    private funcionesService: FuncionesService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.cargarProductos();
    this.cargarBuscador();
    this.verificarServicio();
    this.cargarMarcas();
  }

  verificarServicio() {
    this.cargando = this.busquedaProductosPorNombreService.cargando;

      let intervalo = setInterval(() => {
        if (this.cargando) {
          this.cargando = this.busquedaProductosPorNombreService.cargando;
          this.totalProductos = this.busquedaProductosPorNombreService.totalProductos;      
        } else {
          clearInterval(intervalo);
        }
      }, 1000)

  }

  cargarProductos() {
    // this.apiService.peticionGet('productos?desde=' + this.desde)
    //   .subscribe((data: any) => {
    //     console.log(data);
    //     this.productos = data.productos;
    //     this.totalProductos = data.total;
    //     this.cargando = false;
    //   });
  }

  cargarBuscador() {
    this.busquedaProductosPorNombreService.obtenerProductos('productos-lista-completa');





    // fromEvent(this.inputProductoPorNombre.nativeElement, 'keyup').pipe(debounceTime(400)
    // , distinctUntilChanged()
    // , map((event: KeyboardEvent) => (<HTMLInputElement>event.target).value)
    // , switchMap(title => this.busquedaProductosPorNombreService.obtenerProductosFiltrados(title)))
    // .subscribe((productos: any) => {
    //   this.productos = productos;
    //   // console.log({categoriasFiltradas: this.categoriasFiltradas});
    // });

    // fromEvent(this.inputProductoPorModelo.nativeElement, 'keyup').pipe(debounceTime(400)
    // , distinctUntilChanged()
    // , map((event: KeyboardEvent) => (<HTMLInputElement>event.target).value)
    // , switchMap(title => this.busquedaProductosPorNombreService.obtenerProductosFiltradosPorModelo(title)))
    // .subscribe((productos: any) => {
    //   this.productos = productos;
    //   // console.log({categoriasFiltradas: this.categoriasFiltradas});
    // });

    // fromEvent(this.inputProductoPorReferencia.nativeElement, 'keyup').pipe(debounceTime(400)
    // , distinctUntilChanged()
    // , map((event: KeyboardEvent) => (<HTMLInputElement>event.target).value)
    // , switchMap(title => this.busquedaProductosPorNombreService.obtenerProductosFiltradosPorReferencia(title)))
    // .subscribe((productos: any) => {
    //   this.productos = productos;
    //   // console.log({categoriasFiltradas: this.categoriasFiltradas});
    // });

    fromEvent(this.inputBusqueda.nativeElement, 'keyup').pipe(debounceTime(400)
    , distinctUntilChanged()
    , map((event: KeyboardEvent) => (<HTMLInputElement>event.target).value)
    , switchMap(title => this.busquedaProductosPorNombreService.obtenerProductosFiltrados2(title, this.tipoBusqueda)))
    .subscribe((productos: any) => {
      this.productosFiltrados = productos;
      // console.log({categoriasFiltradas: this.categoriasFiltradas});
    });
  }

  cambiarDesde( valor: number ) {

    const desde = this.desde + valor;
    console.log(desde);

    if ( desde >= this.totalProductos ) {
      return;
    }

    if ( desde < 0 ) {
      return;
    }

    this.desde += valor;
    this.cargarProductos();

  }

  ordenar() {
    swal(':(', 'Funcion no creada', 'warning');
  }

  quitarOpcion(opcion) {
    this.opciones = this.opciones.filter(element => element !== opcion);
    this.otrasOpciones.push(opcion);
  }

  agregarOpcion(opcion) {
    this.otrasOpciones = this.otrasOpciones.filter(element => element !== opcion);
    if (this.opciones.length === 3) {
      this.otrasOpciones.push(this.opciones[2]);
      this.opciones[2] = opcion;
    } else {
      this.opciones.push(opcion);
    }
  }


  cambiarModelo(modeloNuevo, productoId, indice) {
    console.log({ modeloNuevo, productoId, indice });

    const PRODUCTO = this.productosFiltrados[indice];
    const CARACTERISTICAS = PRODUCTO.caracteristicas;
    CARACTERISTICAS.modelo = modeloNuevo;

    console.log({ CARACTERISTICAS });

    this.apiService.peticionesPut(`editar-caracteristicas/${productoId}`, CARACTERISTICAS)
      .subscribe((data: any) => {
        swal(`:)`, `Se cambió el nombre en la base de datos`, 'success');
        this.productosFiltrados[indice].editarModelo = false;
      });
  }

  cambiarReferencia(referenciaNueva, productoId, indice) {
    console.log({ referenciaNueva, productoId, indice });

    const PRODUCTO = this.productosFiltrados[indice];
    const CARACTERISTICAS = PRODUCTO.caracteristicas;
    CARACTERISTICAS.referencia = referenciaNueva;

    console.log({ CARACTERISTICAS });

    this.apiService.peticionesPut(`editar-caracteristicas/${productoId}`, CARACTERISTICAS)
      .subscribe((data: any) => {
        swal(`:)`, `Se cambió el nombre en la base de datos`, 'success');
        this.productosFiltrados[indice].editarReferencia = false;
      });
  }

  cambiarEAN13(ean13Nuevo, productoId, indice) {
    console.log({ ean13Nuevo, productoId, indice });

    const PRODUCTO = this.productosFiltrados[indice];
    const CARACTERISTICAS = PRODUCTO.caracteristicas;
    CARACTERISTICAS.ean13 = ean13Nuevo;

    console.log({ CARACTERISTICAS });

    this.apiService.peticionesPut(`editar-caracteristicas/${productoId}`, CARACTERISTICAS)
      .subscribe((data: any) => {
        swal(`:)`, `Se cambió el ean13 en la base de datos`, 'success');
        this.productosFiltrados[indice].editarEAN13 = false;
      });
  }

  cambiarEAN14(ean14Nuevo, productoId, indice) {
    console.log({ ean14Nuevo, productoId, indice });

    const PRODUCTO = this.productosFiltrados[indice];
    const CARACTERISTICAS = PRODUCTO.caracteristicas;
    CARACTERISTICAS.ean14 = ean14Nuevo;

    console.log({ CARACTERISTICAS });

    this.apiService.peticionesPut(`editar-caracteristicas/${productoId}`, CARACTERISTICAS)
      .subscribe((data: any) => {
        swal(`:)`, `Se cambió el ean14 en la base de datos`, 'success');
        this.productosFiltrados[indice].editarEAN14 = false;
      });
  }


  cambiarEtiqueta(etiquetaNueva, productoId, indice) {
    console.log({
      etiquetaNueva, productoId, indice
    });

    const objetoEtiqueta = {
      etiqueta: etiquetaNueva
    };

    this.apiService.peticionesPut(`editar-etiqueta/${productoId}`, objetoEtiqueta)
      .subscribe((data: any) => {
        swal(`:)`, `Se cambió el nombre en la base de datos`, 'success');
        // console.log('Bien');
        // this.router.navigate(['productos', 'producto', data.producto._id]);
        this.productosFiltrados[indice].editarEtiqueta = false;
      });
  }

  cambiarNombre(nombreNuevo, productoId, indice) {
    console.log({
      nombreNuevo, productoId, indice
    });

    const objetoNombre = {
      nombre: nombreNuevo,
      slug: this.funcionesService.stringToSlug(nombreNuevo)
    };

    this.apiService.peticionesPut(`editar-nombre/${productoId}`, objetoNombre)
      .subscribe((data: any) => {
        swal(`:)`, `Se cambió el nombre en la base de datos`, 'success');
        // console.log('Bien');
        // this.router.navigate(['productos', 'producto', data.producto._id]);
        this.productosFiltrados[indice].editarNombre = false;
      });
  }

  mostrarModal(idProducto, nombreProducto, indice) {
    const modal = this.modalService.open(CategoriaFormComponent);
    modal.result.then(
      this.handleModalTodoFormClose.bind(this),
      this.handleModalTodoFormClose.bind(this)
    )
    modal.componentInstance.idProducto = idProducto;
    modal.componentInstance.nombreProducto = nombreProducto;
    modal.componentInstance.indice = indice;
  }

  handleModalTodoFormClose(response) {
    if (response === Object(response)) {
      this.productosFiltrados[response.indice].editarCategoria = false;
      this.productosFiltrados[response.indice].categoria.nombre = response.nombreCategoriaNueva;
    }
  }

  cargarMarcas() {
    this.apiService.peticionGet('nombre-marcas-lista-completa')
      .subscribe(
        (data: any) => {
          this.marcas = data.marcas;
          // console.log(this.marcas);
        }
      )
  }

  cambiarMarca(marcaIdNueva, marcaNombreNuevo, productoId, indice) {
    console.log({
      marcaIdNueva, productoId, indice, marcaNombreNuevo
    });


    const objetoMarca = {
      marca: marcaIdNueva
    };

    this.apiService.peticionesPut(`editar-marca/${productoId}`, objetoMarca)
      .subscribe((data: any) => {
        swal(`:)`, `Se cambió la marca en la base de datos`, 'success');
        // console.log('Bien');
        // this.router.navigate(['productos', 'producto', data.producto._id]);
        this.productosFiltrados[indice].editarMarca = false;
        this.productosFiltrados[indice].marca.nombre = this.marcaTemp.nombre;
      });

  }

  crearMarcaTemp(marca) {
    console.log({ marca });

    this.marcaTemp = this.marcas.find(element => element._id === marca)

    console.log({ marcaTemp: this.marcaTemp });

  }

  editarCmmf(indice) {
    const PRODUCTO = this.productosFiltrados[indice];
    console.log(PRODUCTO.cmmf);

    const modal = this.modalService.open(CmmfFormComponent);
    modal.result.then(
      this.cerrarModalCmmf.bind(this),
      this.cerrarModalCmmf.bind(this)
    )
    modal.componentInstance.idProducto = PRODUCTO._id;
    modal.componentInstance.nombreProducto = PRODUCTO.nombre;
    modal.componentInstance.cmmf = PRODUCTO.cmmf;
    modal.componentInstance.indice = indice;
  }


  cerrarModalCmmf(response) {
    if (response === Object(response)) {
      this.productosFiltrados[response.indice].cmmf = response.cmmf;
    }
  }

}
