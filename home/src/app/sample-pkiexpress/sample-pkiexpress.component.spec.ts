import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SamplePkiexpressComponent } from './sample-pkiexpress.component';

describe('SamplePkiexpressComponent', () => {
  let component: SamplePkiexpressComponent;
  let fixture: ComponentFixture<SamplePkiexpressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SamplePkiexpressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SamplePkiexpressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
