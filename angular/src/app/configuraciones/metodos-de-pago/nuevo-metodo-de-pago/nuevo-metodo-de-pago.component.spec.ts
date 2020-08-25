import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoMetodoDePagoComponent } from './nuevo-metodo-de-pago.component';

describe('NuevoMetodoDePagoComponent', () => {
  let component: NuevoMetodoDePagoComponent;
  let fixture: ComponentFixture<NuevoMetodoDePagoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevoMetodoDePagoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevoMetodoDePagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
