import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearHermandadComponent } from './crear-hermandad.component';

describe('CrearHermandadComponent', () => {
  let component: CrearHermandadComponent;
  let fixture: ComponentFixture<CrearHermandadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearHermandadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearHermandadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
