import { TestBed } from '@angular/core/testing';

import { MinMaxLimitsResolverService } from './min-max-limits-resolver.service';

describe('MinMaxLimitsResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MinMaxLimitsResolverService = TestBed.get(MinMaxLimitsResolverService);
    expect(service).toBeTruthy();
  });
});
