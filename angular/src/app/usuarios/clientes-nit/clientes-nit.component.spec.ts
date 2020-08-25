import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientesNitComponent } from './clientes-nit.component';

describe('ClientesNitComponent', () => {
  let component: ClientesNitComponent;
  let fixture: ComponentFixture<ClientesNitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientesNitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientesNitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
