import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateXmlSigComponent } from './validate-xml-sig.component';

describe('ValidateXmlSigComponent', () => {
  let component: ValidateXmlSigComponent;
  let fixture: ComponentFixture<ValidateXmlSigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidateXmlSigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateXmlSigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
