import { TestBed } from '@angular/core/testing';

import { ApplicationRelationshipResolverService } from './application-relationship-resolver.service';

describe('ApplicationRelationshipResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApplicationRelationshipResolverService = TestBed.get(ApplicationRelationshipResolverService);
    expect(service).toBeTruthy();
  });
});
