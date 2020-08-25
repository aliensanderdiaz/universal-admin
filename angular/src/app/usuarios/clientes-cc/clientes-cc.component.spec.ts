import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientesCcComponent } from './clientes-cc.component';

describe('ClientesCcComponent', () => {
  let component: ClientesCcComponent;
  let fixture: ComponentFixture<ClientesCcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientesCcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientesCcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
