import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignCodComponent } from './sign-cod.component';

describe('SignCodComponent', () => {
  let component: SignCodComponent;
  let fixture: ComponentFixture<SignCodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignCodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignCodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
