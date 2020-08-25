import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionInventarioComponent } from './gestion-inventario.component';

describe('GestionInventarioComponent', () => {
  let component: GestionInventarioComponent;
  let fixture: ComponentFixture<GestionInventarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionInventarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
