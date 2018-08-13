import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignMultiCmsServerComponent } from './sign-multi-cms-server.component';

describe('SignMultiCmsServerComponent', () => {
  let component: SignMultiCmsServerComponent;
  let fixture: ComponentFixture<SignMultiCmsServerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignMultiCmsServerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignMultiCmsServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
