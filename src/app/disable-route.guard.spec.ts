import { TestBed, async, inject } from '@angular/core/testing';

import { DisableRouteGuard } from './disable-route.guard';

describe('DisableRouteGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DisableRouteGuard]
    });
  });

  it('should ...', inject([DisableRouteGuard], (guard: DisableRouteGuard) => {
    expect(guard).toBeTruthy();
  }));
});
