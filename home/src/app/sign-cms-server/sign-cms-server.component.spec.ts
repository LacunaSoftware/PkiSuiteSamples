import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignCmsServerComponent } from './sign-cms-server.component';

describe('SignCmsServerComponent', () => {
  let component: SignCmsServerComponent;
  let fixture: ComponentFixture<SignCmsServerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignCmsServerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignCmsServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
