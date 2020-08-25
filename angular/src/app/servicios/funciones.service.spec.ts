import { TestBed, inject } from '@angular/core/testing';

import { FuncionesService } from './funciones.service';

describe('FuncionesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FuncionesService]
    });
  });

  it('should be created', inject([FuncionesService], (service: FuncionesService) => {
    expect(service).toBeTruthy();
  }));
});
