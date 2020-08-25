import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PorMarcaCategoriaComponent } from './por-marca-categoria.component';

describe('PorMarcaCategoriaComponent', () => {
  let component: PorMarcaCategoriaComponent;
  let fixture: ComponentFixture<PorMarcaCategoriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PorMarcaCategoriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PorMarcaCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
