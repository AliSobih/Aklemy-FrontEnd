import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '@common/constants';
import { PageRequest } from '@common/PageRequest';
import { Review } from '@common/review';
import { Subject, Observable, tap, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private userCountry = sessionStorage.getItem('userCountry');

  private reviewiesUpdated = new Subject<void>();

  constructor(private http: HttpClient) {}

  getallData(
    courseId: number,
    page: number,
    pageSize: number
  ): Observable<any> {
    return this.http.post<any>(`${Constants.REVIEW_ALL_API}${courseId}`, {
      page: page,
      limit: pageSize,
    });
  }

  getAllReview(): Observable<Review[]> {
    return this.http.get<Review[]>(Constants.REVIEW_ALLDATA_API);
  }

  getData(id: number, page: number, pageSize: number): Observable<any> {
    return this.http.post<any>(Constants.REVIEW_ALL_API + `${id}`, {
      page: page,
      limit: 50,
    });
  }
  getReviewPages(page: number = 1, pageSize: number = 10): Observable<any> {
    return this.http.post<any>(`${Constants.REVIEW_PAGE_API}`, {
      page: page,
      limit: pageSize,
    });
  }

  postData(data: Review): Observable<Review> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post<Review>(Constants.REVIEW_ADD_API, data, { headers })
      .pipe(
        tap(() => {
          this.reviewiesUpdated.next();
        })
      );
  }

  deleteData(id: Review): Observable<Review> {
    return this.http.delete<any>(Constants.REVIEW_DELETE_API + id).pipe(
      tap(() => {
        this.reviewiesUpdated.next();
      })
    );
  }

  updateData(data: Review): Observable<Review> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .put<Review>(Constants.REVIEW_UPDATE_API + data.id, data, { headers })
      .pipe(
        tap(() => {
          this.reviewiesUpdated.next();
        })
      );
  }

  getReviewUpdateListener(): Observable<void> {
    return this.reviewiesUpdated.asObservable();
  }
}
