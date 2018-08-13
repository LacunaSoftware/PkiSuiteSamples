import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueCertServerComponent } from './issue-cert-server.component';

describe('IssueCertServerComponent', () => {
  let component: IssueCertServerComponent;
  let fixture: ComponentFixture<IssueCertServerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueCertServerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueCertServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
