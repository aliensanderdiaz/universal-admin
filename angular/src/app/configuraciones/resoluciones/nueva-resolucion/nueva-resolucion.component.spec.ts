import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaResolucionComponent } from './nueva-resolucion.component';

describe('NuevaResolucionComponent', () => {
  let component: NuevaResolucionComponent;
  let fixture: ComponentFixture<NuevaResolucionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevaResolucionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevaResolucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
