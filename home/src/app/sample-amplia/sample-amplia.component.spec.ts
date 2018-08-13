import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleAmpliaComponent } from './sample-amplia.component';

describe('SampleAmpliaComponent', () => {
  let component: SampleAmpliaComponent;
  let fixture: ComponentFixture<SampleAmpliaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SampleAmpliaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleAmpliaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
