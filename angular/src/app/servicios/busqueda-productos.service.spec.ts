import { TestBed, inject } from '@angular/core/testing';

import { BusquedaProductosService } from './busqueda-productos.service';

describe('BusquedaProductosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BusquedaProductosService]
    });
  });

  it('should be created', inject([BusquedaProductosService], (service: BusquedaProductosService) => {
    expect(service).toBeTruthy();
  }));
});
