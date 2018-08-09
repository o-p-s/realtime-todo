import { TestBed, inject } from '@angular/core/testing';

import { CountryCodesService } from './country-codes.service';

describe('CountryCodesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CountryCodesService]
    });
  });

  it('should be created', inject([CountryCodesService], (service: CountryCodesService) => {
    expect(service).toBeTruthy();
  }));
});
