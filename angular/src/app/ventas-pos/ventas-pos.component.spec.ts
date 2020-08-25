import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasPosComponent } from './ventas-pos.component';

describe('VentasPosComponent', () => {
  let component: VentasPosComponent;
  let fixture: ComponentFixture<VentasPosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentasPosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentasPosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
