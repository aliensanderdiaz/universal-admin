import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCaracteristicasComponent } from './editar-caracteristicas.component';

describe('EditarCaracteristicasComponent', () => {
  let component: EditarCaracteristicasComponent;
  let fixture: ComponentFixture<EditarCaracteristicasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarCaracteristicasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarCaracteristicasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
