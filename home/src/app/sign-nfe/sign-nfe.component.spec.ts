import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignNfeComponent } from './sign-nfe.component';

describe('SignNfeComponent', () => {
  let component: SignNfeComponent;
  let fixture: ComponentFixture<SignNfeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignNfeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignNfeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
