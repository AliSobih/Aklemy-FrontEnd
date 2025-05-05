import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Answer } from '@common/answer';
import { Constants } from '@common/constants';
import { DragAndDrop } from '@common/drag-and-drop';
import { UserExam } from '@common/user-exam';
import { UserExamDragAndDrop } from '@common/user-exam-drag-and-drop';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserExameService {
  constructor(private http: HttpClient) {}

  getExam(id: number): Observable<UserExam> {
    return this.http.get<UserExam>(`${Constants.USER_EXAM_API}/${id}`);
  }

  startExam(userExam: UserExam): Observable<UserExam> {
    console.log(userExam);
    return this.http.post<UserExam>(Constants.USER_STERT_EXAM_API, userExam);
  }

  markExam(examId: number): Observable<UserExam> {
    return this.http.patch<UserExam>(
      Constants.USER_MARK_EXAM_API + examId,
      null
    );
  }

  pauseExam(userExamId: number, remainingTime: number): Observable<any> {
    return this.http.patch(
      `${Constants.USER_PAUSE_EXAM_API}/${userExamId}/${remainingTime}`,
      null
    );
  }

  markAnswers(answers: number[]): Observable<any> {
    return this.http.patch(
      Constants.USER_EXAME_ANSWER_UPDATE_USER_ANSWER_API,
      answers
    );
  }

  markDragAndDrops(
    userExamDragAndDrop: UserExamDragAndDrop[]
  ): Observable<any> {
    return this.http.patch(
      Constants.DRAG_AND_DROP_MARK_DRAG_AND_DROPS,
      userExamDragAndDrop
    );
  }

  getCorrectAnswers(id: number): Observable<Answer[]> {
    return this.http.get<Answer[]>(Constants.USER_EXAM_CORRECT_ANWERS + id);
  }

  getCorrectDragAndDrop(id: number): Observable<DragAndDrop[]> {
    return this.http.get<DragAndDrop[]>(
      Constants.DRAG_AND_DROP_CORRECT_ANSWERS + id
    );
  }
}
