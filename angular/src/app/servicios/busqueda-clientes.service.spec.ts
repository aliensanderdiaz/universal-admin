import { TestBed, inject } from '@angular/core/testing';

import { BusquedaClientesService } from './busqueda-clientes.service';

describe('BusquedaClientesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BusquedaClientesService]
    });
  });

  it('should be created', inject([BusquedaClientesService], (service: BusquedaClientesService) => {
    expect(service).toBeTruthy();
  }));
});
