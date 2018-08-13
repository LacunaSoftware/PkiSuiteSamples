import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleRestpkiComponent } from './sample-restpki.component';

describe('SampleRestpkiComponent', () => {
  let component: SampleRestpkiComponent;
  let fixture: ComponentFixture<SampleRestpkiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SampleRestpkiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleRestpkiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
