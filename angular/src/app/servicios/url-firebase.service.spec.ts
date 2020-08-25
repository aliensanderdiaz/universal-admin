import { TestBed, inject } from '@angular/core/testing';

import { UrlFirebaseService } from './url-firebase.service';

describe('UrlFirebaseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UrlFirebaseService]
    });
  });

  it('should be created', inject([UrlFirebaseService], (service: UrlFirebaseService) => {
    expect(service).toBeTruthy();
  }));
});
