import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatePdfSigComponent } from './validate-pdf-sig.component';

describe('ValidatePdfSigComponent', () => {
  let component: ValidatePdfSigComponent;
  let fixture: ComponentFixture<ValidatePdfSigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidatePdfSigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatePdfSigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
