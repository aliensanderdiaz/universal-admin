import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarHermandadComponent } from './editar-hermandad.component';

describe('EditarHermandadComponent', () => {
  let component: EditarHermandadComponent;
  let fixture: ComponentFixture<EditarHermandadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarHermandadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarHermandadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
