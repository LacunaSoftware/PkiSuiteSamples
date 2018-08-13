import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCertComponent } from './list-cert.component';

describe('ListCertComponent', () => {
  let component: ListCertComponent;
  let fixture: ComponentFixture<ListCertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
