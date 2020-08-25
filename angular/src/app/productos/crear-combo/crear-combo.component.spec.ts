import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearComboComponent } from './crear-combo.component';

describe('CrearComboComponent', () => {
  let component: CrearComboComponent;
  let fixture: ComponentFixture<CrearComboComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearComboComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearComboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
