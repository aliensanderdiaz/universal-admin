import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarImagenesComponent } from './eliminar-imagenes.component';

describe('EliminarImagenesComponent', () => {
  let component: EliminarImagenesComponent;
  let fixture: ComponentFixture<EliminarImagenesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EliminarImagenesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EliminarImagenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
