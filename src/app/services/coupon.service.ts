import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '@common/constants';
import { Coupon } from '@common/coupon';
import { Subject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  private cateCouponUpdated = new Subject<void>();

  constructor(private http: HttpClient) {}

  getallData(courseId: number): Observable<Coupon[]> {
    return this.http.get<Coupon[]>(Constants.COUPON_COURSE_API + courseId);
  }

  getData(id: number): Observable<Coupon> {
    return this.http.get<Coupon>(Constants.COUPON_API + `/${id}`);
  }

  postData(data: Coupon): Observable<Coupon> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post<Coupon>(Constants.COUPON_ADD_API, data, { headers })
      .pipe(
        tap(() => {
          this.cateCouponUpdated.next();
        })
      );
  }

  deleteData(id: string): Observable<void> {
    return this.http.delete<void>(Constants.COUPON_DELETE_API + id).pipe(
      tap(() => {
        this.cateCouponUpdated.next();
      })
    );
  }

  updateData(data: Coupon): Observable<Coupon> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .put<Coupon>(Constants.COUPON_UPDATE_API + data.id, data, {
        headers,
      })
      .pipe(
        tap(() => {
          this.cateCouponUpdated.next();
        })
      );
  }

  getCouponUpdateListener(): Observable<void> {
    return this.cateCouponUpdated.asObservable();
  }
}
