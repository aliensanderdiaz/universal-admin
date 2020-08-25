import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerArbolDosComponent } from './ver-arbol-dos.component';

describe('VerArbolDosComponent', () => {
  let component: VerArbolDosComponent;
  let fixture: ComponentFixture<VerArbolDosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerArbolDosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerArbolDosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
