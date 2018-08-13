import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignPdfServerComponent } from './sign-pdf-server.component';

describe('SignPdfServerComponent', () => {
  let component: SignPdfServerComponent;
  let fixture: ComponentFixture<SignPdfServerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignPdfServerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignPdfServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
