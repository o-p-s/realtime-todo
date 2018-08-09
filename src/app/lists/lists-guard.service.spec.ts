import { TestBed, inject } from '@angular/core/testing';

import { MainRouteGuardService } from './main-route-guard.service';

describe('MainRouteGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MainRouteGuardService]
    });
  });

  it('should be created', inject([MainRouteGuardService], (service: MainRouteGuardService) => {
    expect(service).toBeTruthy();
  }));
});
