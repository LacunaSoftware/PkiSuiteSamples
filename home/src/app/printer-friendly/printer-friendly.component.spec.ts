import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrinterFriendlyComponent } from './printer-friendly.component';

describe('PrinterFriendlyComponent', () => {
  let component: PrinterFriendlyComponent;
  let fixture: ComponentFixture<PrinterFriendlyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrinterFriendlyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrinterFriendlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
