import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmmfFormComponent } from './cmmf-form.component';

describe('CmmfFormComponent', () => {
  let component: CmmfFormComponent;
  let fixture: ComponentFixture<CmmfFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmmfFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmmfFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
