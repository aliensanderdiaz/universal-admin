import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearProductoSencilloComponent } from './crear-producto-sencillo.component';

describe('CrearProductoSencilloComponent', () => {
  let component: CrearProductoSencilloComponent;
  let fixture: ComponentFixture<CrearProductoSencilloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearProductoSencilloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearProductoSencilloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
