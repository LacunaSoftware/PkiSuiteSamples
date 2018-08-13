import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignCmsUserComponent } from './sign-cms-user.component';

describe('SignCmsUserComponent', () => {
  let component: SignCmsUserComponent;
  let fixture: ComponentFixture<SignCmsUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignCmsUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignCmsUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
