import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HermandadComponent } from './hermandad.component';

describe('HermandadComponent', () => {
  let component: HermandadComponent;
  let fixture: ComponentFixture<HermandadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HermandadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HermandadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
