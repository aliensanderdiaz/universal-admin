import { TestBed, inject } from '@angular/core/testing';

import { ArbolCategoriasService } from './arbol-categorias.service';

describe('ArbolCategoriasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArbolCategoriasService]
    });
  });

  it('should be created', inject([ArbolCategoriasService], (service: ArbolCategoriasService) => {
    expect(service).toBeTruthy();
  }));
});
