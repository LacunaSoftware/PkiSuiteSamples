import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CosignPdfComponent } from './cosign-pdf.component';

describe('CosignPdfComponent', () => {
  let component: CosignPdfComponent;
  let fixture: ComponentFixture<CosignPdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CosignPdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CosignPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
