import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { directionGuard } from './direction.guard';

describe('directionGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => directionGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
