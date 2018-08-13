import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignXmlServerComponent } from './sign-xml-server.component';

describe('SignXmlServerComponent', () => {
  let component: SignXmlServerComponent;
  let fixture: ComponentFixture<SignXmlServerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignXmlServerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignXmlServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
