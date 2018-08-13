import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthCertComponent } from './auth-cert.component';

describe('AuthCertComponent', () => {
  let component: AuthCertComponent;
  let fixture: ComponentFixture<AuthCertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthCertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthCertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
