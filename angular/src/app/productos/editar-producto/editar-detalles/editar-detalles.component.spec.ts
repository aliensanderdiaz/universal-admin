import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarDetallesComponent } from './editar-detalles.component';

describe('EditarDetallesComponent', () => {
  let component: EditarDetallesComponent;
  let fixture: ComponentFixture<EditarDetallesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarDetallesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarDetallesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
