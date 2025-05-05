import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Watch } from '@angular/core/primitives/signals';
import { Constants } from '@common/constants';
import { Watched } from '@common/watched';
import { Observable, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WatchedService {
  private WatchUpdated = new Subject<void>();

  constructor(private http: HttpClient) {}
  getWatchlesson(sectionId: number, userId: number): Observable<any[]> {
    // Add a return statement here
    return this.http.get<any[]>(
      Constants.WATCHED_LESSON_API + '/' + sectionId + '/' + userId
    );
  }
  getWatchCorse(
    courseId: number,
    userId: number
  ): Observable<{ sectionId: number; watchedLessons: number }[]> {
    // Add a return statement here
    return this.http.get<{ sectionId: number; watchedLessons: number }[]>(
      Constants.WATCHED_COURSE_PER_API + '/' + courseId + '/' + userId
    );
  }

  postData(data: Watched) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log('watch data: ', data);
    return this.http
      .post<Watched>(Constants.WATCHED_LESSON_ADD_API, data, {
        headers,
      })
      .pipe(
        tap(() => {
          this.WatchUpdated.next();
        })
      );
  }
  getTeacherRequestUpdateListener(): Observable<void> {
    return this.WatchUpdated.asObservable();
  }
}
