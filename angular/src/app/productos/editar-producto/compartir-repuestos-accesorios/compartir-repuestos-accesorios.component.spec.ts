import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompartirRepuestosAccesoriosComponent } from './compartir-repuestos-accesorios.component';

describe('CompartirRepuestosAccesoriosComponent', () => {
  let component: CompartirRepuestosAccesoriosComponent;
  let fixture: ComponentFixture<CompartirRepuestosAccesoriosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompartirRepuestosAccesoriosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompartirRepuestosAccesoriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
