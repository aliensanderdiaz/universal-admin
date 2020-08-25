import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerArbolTresComponent } from './ver-arbol-tres.component';

describe('VerArbolTresComponent', () => {
  let component: VerArbolTresComponent;
  let fixture: ComponentFixture<VerArbolTresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerArbolTresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerArbolTresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
