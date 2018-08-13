import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignMultiCmsUserComponent } from './sign-multi-cms-user.component';

describe('SignMultiCmsUserComponent', () => {
  let component: SignMultiCmsUserComponent;
  let fixture: ComponentFixture<SignMultiCmsUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignMultiCmsUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignMultiCmsUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
