import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SamplePkisdkComponent } from './sample-pkisdk.component';

describe('SamplePkisdkComponent', () => {
  let component: SamplePkisdkComponent;
  let fixture: ComponentFixture<SamplePkisdkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SamplePkisdkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamplePkisdkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
