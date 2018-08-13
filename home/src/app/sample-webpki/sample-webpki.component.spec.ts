import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleWebpkiComponent } from './sample-webpki.component';

describe('SampleWebpkiComponent', () => {
  let component: SampleWebpkiComponent;
  let fixture: ComponentFixture<SampleWebpkiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SampleWebpkiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleWebpkiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
