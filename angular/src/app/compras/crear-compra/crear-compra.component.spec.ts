import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearCompraComponent } from './crear-compra.component';

describe('CrearCompraComponent', () => {
  let component: CrearCompraComponent;
  let fixture: ComponentFixture<CrearCompraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearCompraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
