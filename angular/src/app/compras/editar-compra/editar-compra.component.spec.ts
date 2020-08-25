import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCompraComponent } from './editar-compra.component';

describe('EditarCompraComponent', () => {
  let component: EditarCompraComponent;
  let fixture: ComponentFixture<EditarCompraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarCompraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
