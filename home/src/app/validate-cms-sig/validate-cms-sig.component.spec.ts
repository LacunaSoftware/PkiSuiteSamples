import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateCmsSigComponent } from './validate-cms-sig.component';

describe('ValidateCmsSigComponent', () => {
  let component: ValidateCmsSigComponent;
  let fixture: ComponentFixture<ValidateCmsSigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidateCmsSigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateCmsSigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
