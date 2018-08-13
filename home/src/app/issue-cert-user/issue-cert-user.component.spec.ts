import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueCertUserComponent } from './issue-cert-user.component';

describe('IssueCertUserComponent', () => {
  let component: IssueCertUserComponent;
  let fixture: ComponentFixture<IssueCertUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueCertUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueCertUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
