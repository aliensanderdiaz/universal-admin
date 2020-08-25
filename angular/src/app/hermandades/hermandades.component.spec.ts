import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HermandadesComponent } from './hermandades.component';

describe('HermandadesComponent', () => {
  let component: HermandadesComponent;
  let fixture: ComponentFixture<HermandadesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HermandadesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HermandadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
