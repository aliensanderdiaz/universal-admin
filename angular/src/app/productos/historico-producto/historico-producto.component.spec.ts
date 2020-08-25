import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoProductoComponent } from './historico-producto.component';

describe('HistoricoProductoComponent', () => {
  let component: HistoricoProductoComponent;
  let fixture: ComponentFixture<HistoricoProductoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricoProductoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricoProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
