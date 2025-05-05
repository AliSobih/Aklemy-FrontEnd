import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '@common/constants';
import { PageRequest } from '@common/PageRequest';
import { TeacherRequest } from '@common/teacher-request';
import { Observable, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TeacherRequestService {
  private TeacherRequestUpdated = new Subject<void>();
  constructor(private http: HttpClient) { }
  getAlldata(): Observable<TeacherRequest[]> {
    return this.http.get<TeacherRequest[]>(Constants.TEACHER_REQUEST_ALL_API);
  }
  getCoursePages(
    pageSize: number,
    page: number
  ): Observable<PageRequest<TeacherRequest>> {
    return this.http.post<any>(
      Constants.TEACHER_REQUEST_PAGE_API,
      {
        page: page,
        limit: pageSize,
      }
    );
  }

  postData(data: TeacherRequest) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .post<TeacherRequest>(Constants.TEACHER_REQUEST_ADD_API, data, {
        headers,
      })
      .pipe(
        tap(() => {
          this.TeacherRequestUpdated.next();
        })
      );
  }
  getTeacherRequestUpdateListener(): Observable<void> {
    return this.TeacherRequestUpdated.asObservable();
  }

  approve(email: string) {
    return this.http.patch(`${Constants.TEACHER_REQUEST_APPROVE_API}/${email}`, null);
  }

}
