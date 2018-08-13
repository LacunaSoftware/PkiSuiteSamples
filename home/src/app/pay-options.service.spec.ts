import { TestBed, inject } from '@angular/core/testing';

import { PayOptionsService } from './pay-options.service';

describe('PayOptionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PayOptionsService]
    });
  });

  it('should be created', inject([PayOptionsService], (service: PayOptionsService) => {
    expect(service).toBeTruthy();
  }));
});
