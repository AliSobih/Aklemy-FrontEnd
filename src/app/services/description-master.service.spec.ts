import { TestBed } from '@angular/core/testing';

import { DescriptionMasterService } from './description-master.service';

describe('DescriptionMasterService', () => {
  let service: DescriptionMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DescriptionMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
