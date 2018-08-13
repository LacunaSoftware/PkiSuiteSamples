import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignPdfUserComponent } from './sign-pdf-user.component';

describe('SignPdfUserComponent', () => {
  let component: SignPdfUserComponent;
  let fixture: ComponentFixture<SignPdfUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignPdfUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignPdfUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
