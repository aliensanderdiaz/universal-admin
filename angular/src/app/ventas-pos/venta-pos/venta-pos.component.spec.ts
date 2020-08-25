import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VentaPosComponent } from './venta-pos.component';

describe('VentaPosComponent', () => {
  let component: VentaPosComponent;
  let fixture: ComponentFixture<VentaPosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VentaPosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VentaPosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
