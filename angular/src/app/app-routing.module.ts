import { EditarCaracteristicasComponent } from './productos/editar-producto/editar-caracteristicas/editar-caracteristicas.component';
import { CrearComboComponent } from './productos/crear-combo/crear-combo.component';
import { CrearPedidoComponent } from './productos/crear-pedido/crear-pedido.component';
import { BusquedaProductosComponent } from './productos/busqueda-productos/busqueda-productos.component';
import { AgregarVideosCmmfComponent } from './productos/editar-producto/agregar-videos-cmmf/agregar-videos-cmmf.component';
import { EditarDetallesComponent } from './productos/editar-producto/editar-detalles/editar-detalles.component';
import { VerArbolDosComponent } from './categorias/ver-arbol-dos/ver-arbol-dos.component';
import { EliminarImagenesComponent } from './productos/editar-producto/eliminar-imagenes/eliminar-imagenes.component';
import { CategoriaComponent } from './categorias/categoria/categoria.component';
import { ComprasComponent } from './compras/compras.component';
import { EditarMarcaComponent } from './marcas/editar-marca/editar-marca.component';
import { EditarCategoriaComponent } from './categorias/editar-categoria/editar-categoria.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MarcasComponent } from './marcas/marcas.component';
import { CrearMarcaComponent } from './marcas/crear-marca/crear-marca.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { CrearCategoriaComponent } from './categorias/crear-categoria/crear-categoria.component';
import { ProductosComponent } from './productos/productos.component';
import { CrearProductoComponent } from './productos/crear-producto/crear-producto.component';
import { ProductoComponent } from './productos/producto/producto.component';
import { EditarProductoComponent } from './productos/editar-producto/editar-producto.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { CrearProveedorComponent } from './proveedores/crear-proveedor/crear-proveedor.component';
import { CrearCompraComponent } from './compras/crear-compra/crear-compra.component';
import { CrearDesdeComponent } from './productos/crear-desde/crear-desde.component';
import { AgregarImagenesComponent } from './productos/editar-producto/agregar-imagenes/agregar-imagenes.component';
import { AgregarDescripcionComponent } from './productos/editar-producto/agregar-descripcion/agregar-descripcion.component';
import { CompraComponent } from './compras/compra/compra.component';
import { EditarCompraComponent } from './compras/editar-compra/editar-compra.component';
import { VentasComponent } from './ventas/ventas.component';
import { CrearVentaComponent } from './ventas/crear-venta/crear-venta.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { CrearUsuarioComponent } from './usuarios/crear-usuario/crear-usuario.component';
import { VentaComponent } from './ventas/venta/venta.component';
import { MarcaComponent } from './marcas/marca/marca.component';
import { AgregarHermanosComponent } from './productos/editar-producto/agregar-hermanos/agregar-hermanos.component';
import { HistoricoComprasComponent } from './compras/historico-compras/historico-compras.component';
import { HistoricoProductoComponent } from './productos/historico-producto/historico-producto.component';
import { UsuarioComponent } from './usuarios/usuario/usuario.component';
import { ListaOrdenadaComponent } from './productos/lista-ordenada/lista-ordenada.component';
import { CrearProductoSencilloComponent } from './productos/crear-producto-sencillo/crear-producto-sencillo.component';
import { CompartirRepuestosAccesoriosComponent } from './productos/editar-producto/compartir-repuestos-accesorios/compartir-repuestos-accesorios.component';
import { VerArbolTresComponent } from './categorias/ver-arbol-tres/ver-arbol-tres.component';
import { PorMarcaCategoriaComponent } from './productos/por-marca-categoria/por-marca-categoria.component';
import { OrdenesComponent } from './ordenes/ordenes.component';
import { ClientesCcComponent } from './usuarios/clientes-cc/clientes-cc.component';
import { ClientesNitComponent } from './usuarios/clientes-nit/clientes-nit.component';
import { ReparacionComponent } from './reparaciones/reparacion/reparacion.component';
import { ReparacionesComponent } from './reparaciones/reparaciones.component';
import { CrearReparacionComponent } from './reparaciones/crear-reparacion/crear-reparacion.component';
import { HermandadesComponent } from './hermandades/hermandades.component';
import { EditarHermandadComponent } from './hermandades/editar-hermandad/editar-hermandad.component';
import { CrearHermandadComponent } from './hermandades/crear-hermandad/crear-hermandad.component';
import { HermandadComponent } from './hermandades/hermandad/hermandad.component';
import { ConfiguracionesComponent } from './configuraciones/configuraciones.component';
import { NuevoMetodoDePagoComponent } from './configuraciones/metodos-de-pago/nuevo-metodo-de-pago/nuevo-metodo-de-pago.component';
import { NuevaResolucionComponent } from './configuraciones/resoluciones/nueva-resolucion/nueva-resolucion.component';
import { ReportesComponent } from './reportes/reportes.component';
import { GestionInventarioComponent } from './gestion-inventario/gestion-inventario.component';
import { HomeComponent } from './home/home.component';
import { ConsultaIndividualComponent } from './gestion-inventario/consulta-individual/consulta-individual.component';
import { VentasPosComponent } from './ventas-pos/ventas-pos.component';
import { VentaPosComponent } from './ventas-pos/venta-pos/venta-pos.component';


const appRoutes: Routes = [
    { path: 'marcas', component: MarcasComponent },
    { path: 'marcas/marca/:id', component: MarcaComponent },
    { path: 'marcas/crear-marca', component: CrearMarcaComponent },
    { path: 'marcas/editar-marca/:id', component: EditarMarcaComponent },
    { path: 'categorias', component: CategoriasComponent },
    { path: 'categorias/ver-arbol-2', component: VerArbolDosComponent },
    { path: 'categorias/ver-arbol-3', component: VerArbolTresComponent },
    { path: 'categorias/categoria/:id', component: CategoriaComponent },
    { path: 'categorias/crear-categoria', component: CrearCategoriaComponent },
    { path: 'categorias/editar-categoria/:id', component: EditarCategoriaComponent },
    { path: 'productos', component: ProductosComponent },
    { path: 'productos/lista-ordenada', component: ListaOrdenadaComponent },
    { path: 'productos/por-marca-categoria', component: PorMarcaCategoriaComponent },
    { path: 'productos/crear-combo/:id', component: CrearComboComponent },
    { path: 'productos/busqueda-productos', component: BusquedaProductosComponent },
    { path: 'productos/crear-pedido', component: CrearPedidoComponent },
    { path: 'productos/crear-producto', component: CrearProductoComponent },
    { path: 'productos/crear-producto-sencillo', component: CrearProductoSencilloComponent },
    { path: 'productos/crear-desde/:id', component: CrearDesdeComponent },
    { path: 'productos/editar-producto/:id', component: EditarProductoComponent },
    { path: 'productos/editar-producto/agregar-imagenes/:id', component: AgregarImagenesComponent },
    { path: 'productos/editar-producto/eliminar-imagenes/:id', component: EliminarImagenesComponent },
    { path: 'productos/editar-producto/agregar-descripcion/:id', component: AgregarDescripcionComponent },
    { path: 'productos/editar-producto/agregar-hermanos/:id', component: AgregarHermanosComponent },
    { path: 'productos/editar-producto/editar-detalles/:id', component: EditarDetallesComponent },
    { path: 'productos/editar-producto/editar-caracteristicas/:id', component: EditarCaracteristicasComponent },
    { path: 'productos/editar-producto/agregar-videos-cmmf/:id', component: AgregarVideosCmmfComponent },
    { path: 'productos/editar-producto/compartir-repuestos-accesorios/:id', component: CompartirRepuestosAccesoriosComponent },
    { path: 'productos/producto/:id', component: ProductoComponent },
    { path: 'productos/historico-producto/:id', component: HistoricoProductoComponent },
    { path: 'proveedores', component: ProveedoresComponent },
    { path: 'proveedores/crear-proveedor', component: CrearProveedorComponent },
    { path: 'compras', component: ComprasComponent },
    { path: 'compras/crear-compra', component: CrearCompraComponent },
    { path: 'compras/compra/:id', component: CompraComponent },
    { path: 'compras/editar-compra/:id', component: EditarCompraComponent },
    { path: 'compras/historico-compras/:id', component: HistoricoComprasComponent },
    { path: 'ventas', component: VentasComponent },
    { path: 'ventas/crear-venta', component: CrearVentaComponent },
    { path: 'ventas/venta/:id', component: VentaComponent },
    { path: 'usuarios', component: UsuariosComponent },
    { path: 'usuarios/clientes-cc', component: ClientesCcComponent },
    { path: 'usuarios/clientes-nit', component: ClientesNitComponent },
    { path: 'usuarios/usuario/:id', component: UsuarioComponent },
    { path: 'usuarios/crear-usuario', component: CrearUsuarioComponent },
    { path: 'ordenes', component: OrdenesComponent },
    { path: 'servicios', component: ReparacionesComponent },
    { path: 'servicios/servicio/:id', component: ReparacionComponent },
    { path: 'servicios/crear-servicio', component: CrearReparacionComponent },
    { path: 'hermandades', component: HermandadesComponent },
    { path: 'hermandades/hermandad/:id', component: HermandadComponent },
    { path: 'hermandades/editar-hermandad/:id', component: EditarHermandadComponent },
    { path: 'hermandades/crear-hermandad', component: CrearHermandadComponent },
    { path: 'configuraciones', component: ConfiguracionesComponent },
    { path: 'configuraciones/metodos-de-pago/nuevo', component: NuevoMetodoDePagoComponent },
    { path: 'configuraciones/resoluciones/nueva', component: NuevaResolucionComponent },
    { path: 'reportes', component: ReportesComponent },
    { path: 'gestion-inventario', component: GestionInventarioComponent },
    { path: 'gestion-inventario/consulta-individual', component: ConsultaIndividualComponent },
    { path: 'home', component: HomeComponent },
    { path: 'ventas-pos', component: VentasPosComponent },
    { path: 'ventas-pos/:id', component: VentaPosComponent },
    { path: '',   redirectTo: '/home', pathMatch: 'full' },
//   { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {useHash: true}
      // { enableTracing: true } // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
