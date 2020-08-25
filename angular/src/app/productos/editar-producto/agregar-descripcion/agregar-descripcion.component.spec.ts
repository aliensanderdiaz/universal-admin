import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarDescripcionComponent } from './agregar-descripcion.component';

describe('AgregarDescripcionComponent', () => {
  let component: AgregarDescripcionComponent;
  let fixture: ComponentFixture<AgregarDescripcionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarDescripcionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarDescripcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
