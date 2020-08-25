import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearDesdeComponent } from './crear-desde.component';

describe('CrearDesdeComponent', () => {
  let component: CrearDesdeComponent;
  let fixture: ComponentFixture<CrearDesdeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearDesdeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearDesdeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
