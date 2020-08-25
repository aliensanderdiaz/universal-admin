import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaProductosComponent } from './busqueda-productos.component';

describe('BusquedaProductosComponent', () => {
  let component: BusquedaProductosComponent;
  let fixture: ComponentFixture<BusquedaProductosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusquedaProductosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
