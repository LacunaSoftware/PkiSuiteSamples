import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignMultiPdfServerComponent } from './sign-multi-pdf-server.component';

describe('SignMultiPdfServerComponent', () => {
  let component: SignMultiPdfServerComponent;
  let fixture: ComponentFixture<SignMultiPdfServerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignMultiPdfServerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignMultiPdfServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
