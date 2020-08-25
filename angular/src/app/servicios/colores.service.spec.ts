import { TestBed, inject } from '@angular/core/testing';

import { ColoresService } from './colores.service';

describe('ColoresService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ColoresService]
    });
  });

  it('should be created', inject([ColoresService], (service: ColoresService) => {
    expect(service).toBeTruthy();
  }));
});
