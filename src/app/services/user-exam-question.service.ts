import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '@common/constants';
import { UserExamQuestion } from '@common/user-exam-question';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserExamQuestionService {
  constructor(private http: HttpClient) {}

  tagQuestion(questionId: number): Observable<void> {
    return this.http.patch<void>(
      Constants.USER_EXAM_QUESTION_TAG_API,
      questionId
    );
  }

  untagQuestion(questionId: number): Observable<void> {
    return this.http.patch<void>(
      Constants.USER_EXAM_QUESTION_UNTAG_API,
      questionId
    );
  }

  getALlTaggedQuestion(examId: number): Observable<UserExamQuestion> {
    return this.http.get<UserExamQuestion>(
      `${Constants.USER_EXAM_QUESTION_ALL_TAG_API}/${examId}`
    );
  }
}
