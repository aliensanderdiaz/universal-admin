import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarImagenesComponent } from './agregar-imagenes.component';

describe('AgregarImagenesComponent', () => {
  let component: AgregarImagenesComponent;
  let fixture: ComponentFixture<AgregarImagenesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarImagenesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarImagenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
