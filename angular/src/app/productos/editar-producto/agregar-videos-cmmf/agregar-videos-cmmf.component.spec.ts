import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarVideosCmmfComponent } from './agregar-videos-cmmf.component';

describe('AgregarVideosCmmfComponent', () => {
  let component: AgregarVideosCmmfComponent;
  let fixture: ComponentFixture<AgregarVideosCmmfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarVideosCmmfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarVideosCmmfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
