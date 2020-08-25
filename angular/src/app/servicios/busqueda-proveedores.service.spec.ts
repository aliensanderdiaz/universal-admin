import { TestBed, inject } from '@angular/core/testing';

import { BusquedaProveedoresService } from './busqueda-proveedores.service';

describe('BusquedaProveedoresService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BusquedaProveedoresService]
    });
  });

  it('should be created', inject([BusquedaProveedoresService], (service: BusquedaProveedoresService) => {
    expect(service).toBeTruthy();
  }));
});
