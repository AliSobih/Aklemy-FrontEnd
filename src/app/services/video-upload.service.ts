import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '@common/constants';
import { Lesson } from '@common/lesson';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class VideoUploadService {
  private cateVideoUploadUpdated = new Subject<void>();

  constructor(private http: HttpClient) {}

  postData(data: FormData): Observable<any> {
    return this.http.post<any>(Constants.COURSE_UPLOAD_VEDIO_API, data).pipe(
      tap(() => {
        this.cateVideoUploadUpdated.next();
      })
    );
  }

  getLessonById(id: number): Observable<Lesson> {
    return this.http.get<Lesson>(Constants.LESSON_API + `/${id}`);
  }

  updateData(
    data: {
      contentType: string | null;
      contentURL: string | null;
      duration: number | null;
    },
    id: number | null
  ): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .patch<any>(Constants.Lesson_PATCH_API + id, data, {
        headers,
      })
      .pipe(
        tap(() => {
          this.cateVideoUploadUpdated.next();
        })
      );
  }
}
