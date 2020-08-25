import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCanvasComponent } from './custom-canvas.component';

describe('CustomCanvasComponent', () => {
  let component: CustomCanvasComponent;
  let fixture: ComponentFixture<CustomCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
