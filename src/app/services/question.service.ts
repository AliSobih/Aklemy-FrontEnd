import { Course } from '@common/course';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Exam } from '../common/exam';
import { Injectable } from '@angular/core';
import { Constants } from '@common/constants';
import { Observable, Subject, tap } from 'rxjs';
import { PageRequest } from '@common/PageRequest';
import { Question } from '@common/question';
import { QuestionSearchRequestDTO } from '@common/questionsearch';
import { Answer } from '@common/answer';
import { DragAndDrop } from '@common/drag-and-drop';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  private examUpdated = new Subject<void>();
  private examDetails = new Subject<Question>();

  constructor(private http: HttpClient) {}

  getQuestionAndEmit() {
    this.getallData().subscribe((data) => {
      this.examDetails.next(data);
    });
  }
  getQuestionPage(
    CourseId: number,
    pageSize: number,
    page: number
  ): Observable<PageRequest<Question>> {
    return this.http.post<any>(Constants.QUESTION_ALL_by_Id_API + CourseId, {
      page: page,
      limit: pageSize,
    });
  }
  searchQuestion(
    pageNumber: number,
    pageSize: number,
    searchQuestion: QuestionSearchRequestDTO
  ): Observable<PageRequest<Question>> {
    return this.http.post<PageRequest<Question>>(
      Constants.Question_SEARCH_API + pageNumber + '/' + pageSize,
      searchQuestion
    );
  }

  getallData(): Observable<Question> {
    return this.http.get<Question>(Constants.QUESTION_ALL_API);
  }
  getQuestionById(id: number): Observable<Question> {
    return this.http.get<Question>(Constants.QUESTION_API + '/' + id);
  }

  getQuestionByCourseId(id: any): Observable<Question[]> {
    return this.http.get<Question[]>(Constants.QUESTION_ALL_API + id);
  }

  postData(data: Question): Observable<Question> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post<Question>(Constants.QUESTION_ADD_API, data, {
        headers,
      })
      .pipe(
        tap(() => {
          this.examUpdated.next();
        })
      );
  }

  deleteData(id: any): Observable<void> {
    return this.http.delete<void>(Constants.QUESTION_DELETE_API + id).pipe(
      tap(() => {
        this.examUpdated.next();
      })
    );
  }

  updateData(data: any): Observable<Question> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .put<Question>(Constants.QUESTION_UPDATE_API + data.id, data, {
        headers,
      })
      .pipe(
        tap(() => {
          this.examUpdated.next();
        })
      );
  }
  uploadPhoto(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<any>(Constants.QUESTION_UPLOAD_IMAGE_API, formData);
  }

  downloadImage(imageName: string): Observable<Blob> {
    return this.http.get(
      `${Constants.QUESTION_DOWNLOAD_IMAGE_API}${imageName}`,
      {
        responseType: 'blob',
      }
    );
  }

  getCorrectAnswers(
    questionId: number
  ): Observable<{ answerDTOS: Answer[]; dragAndDropDTOS: DragAndDrop[] }> {
    return this.http.get<{
      answerDTOS: Answer[];
      dragAndDropDTOS: DragAndDrop[];
    }>(Constants.QUESTION_CORRECT_ANSWER_API + questionId);
  }

  getExamUpdateListener(): Observable<void> {
    return this.examUpdated.asObservable();
  }
}
