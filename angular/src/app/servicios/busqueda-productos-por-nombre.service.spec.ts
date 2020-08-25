import { TestBed, inject } from '@angular/core/testing';

import { BusquedaProductosPorNombreService } from './busqueda-productos-por-nombre.service';

describe('BusquedaProductosPorNombreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BusquedaProductosPorNombreService]
    });
  });

  it('should be created', inject([BusquedaProductosPorNombreService], (service: BusquedaProductosPorNombreService) => {
    expect(service).toBeTruthy();
  }));
});
