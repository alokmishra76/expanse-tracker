import { TestBed } from '@angular/core/testing';

import { ExpanseTrackerService } from './expanse-tracker.service';

describe('ExpanseTrackerService', () => {
  let service: ExpanseTrackerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpanseTrackerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
