import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CosignCmsComponent } from './cosign-cms.component';

describe('CosignCmsComponent', () => {
  let component: CosignCmsComponent;
  let fixture: ComponentFixture<CosignCmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CosignCmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CosignCmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
