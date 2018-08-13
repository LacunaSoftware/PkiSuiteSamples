import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignMultiPdfUserComponent } from './sign-multi-pdf-user.component';

describe('SignMultiPdfUserComponent', () => {
  let component: SignMultiPdfUserComponent;
  let fixture: ComponentFixture<SignMultiPdfUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignMultiPdfUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignMultiPdfUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
