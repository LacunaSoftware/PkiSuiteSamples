import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadCertComponent } from './read-cert.component';

describe('ReadCertComponent', () => {
  let component: ReadCertComponent;
  let fixture: ComponentFixture<ReadCertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadCertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadCertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
