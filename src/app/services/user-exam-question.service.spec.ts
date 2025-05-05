import { TestBed } from '@angular/core/testing';

import { UserExamQuestionService } from './user-exam-question.service';

describe('UserExamQuestionService', () => {
  let service: UserExamQuestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserExamQuestionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
