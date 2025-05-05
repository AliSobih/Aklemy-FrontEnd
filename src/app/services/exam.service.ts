import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '@common/constants';
import { Exam } from '@common/exam';
import { PageRequest } from '@common/PageRequest';
import { Question } from '@common/question';
import { Subject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  private examUpdated = new Subject<void>();
  private examDetails = new Subject<Exam>();

  constructor(private http: HttpClient) {}

  getAllExams(courseId: number): Observable<Exam[]> {
    return this.http.get<Exam[]>(Constants.EXAM_ALL_EXAMS_API + courseId);
  }

  getExamPage(
    courseId: number,
    pageSize: number,
    page: number
  ): Observable<PageRequest<Exam>> {
    return this.http.post<any>(Constants.EXAM_All_curse_API + courseId, {
      page: page,
      limit: pageSize,
    });
  }
  getallData(courseId: number): Observable<Exam> {
    return this.http.get<Exam>(`${Constants.EXAM_curse_API}${courseId}`);
  }

  getExamByCourseIdAndSectionId(
    courseId: number,
    sectionId: number
  ): Observable<Exam> {
    return this.http.get<Exam>(
      `${Constants.EXAM_COURSE_API}${courseId}/${sectionId}`
    );
  }

  getExamsBySection(courseId: number, sectionId: number): Observable<Exam[]> {
    return this.http.get<Exam[]>(
      Constants.EXAM_Section_API + courseId + '/' + sectionId
    );
  }

  getExamByCourseId(courseId: number): Observable<Exam> {
    return this.http.get<Exam>(Constants.EXAM_curse_API + courseId);
  }

  getExamById(id: number): Observable<Exam> {
    return this.http.get<Exam>(`${Constants.EXAM_API}/${id}`);
  }
  getData(id: number): Observable<Exam> {
    return this.http.get<Exam>(Constants.EXAM_API + `/${id}`);
  }

  postData(data: Question): Observable<Exam> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post<Exam>(Constants.EXAM_ADD_API, data, {
        headers,
      })
      .pipe(
        tap(() => {
          this.examUpdated.next();
        })
      );
  }

  deleteData(id: any): Observable<void> {
    return this.http.delete<void>(Constants.EXAM_DELETE_API + id).pipe(
      tap(() => {
        this.examUpdated.next();
      })
    );
  }

  updateData(data: any): Observable<Exam> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .put<Exam>(Constants.EXAM_UPDATE_API + data.id, data, {
        headers,
      })
      .pipe(
        tap(() => {
          this.examUpdated.next();
        })
      );
  }

  getExamUpdateListener(): Observable<void> {
    return this.examUpdated.asObservable();
  }
}
