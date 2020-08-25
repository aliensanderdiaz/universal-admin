import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarHermanosComponent } from './agregar-hermanos.component';

describe('AgregarHermanosComponent', () => {
  let component: AgregarHermanosComponent;
  let fixture: ComponentFixture<AgregarHermanosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarHermanosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarHermanosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
