import { TestBed } from '@angular/core/testing';

import { UserExameService } from './user-exame.service';

describe('UserExameService', () => {
  let service: UserExameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserExameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
