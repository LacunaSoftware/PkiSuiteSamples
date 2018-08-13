import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignXmlUserComponent } from './sign-xml-user.component';

describe('SignXmlUserComponent', () => {
  let component: SignXmlUserComponent;
  let fixture: ComponentFixture<SignXmlUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignXmlUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignXmlUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
