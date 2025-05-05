import { Injectable } from '@angular/core';
import { Nationality } from '../common/nationality';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Observable, tap } from 'rxjs';
import { Constants } from '@common/constants';

@Injectable({
  providedIn: 'root',
})
export class NationalityService {
  private cateNationalityUpdated = new Subject<void>();

  constructor(private http: HttpClient) {}

  getallData(courseId: number): Observable<Nationality[]> {
    return this.http.get<Nationality[]>(
      Constants.NATIONALITY_COURSE_API + courseId
    );
  }

  getData(id: number): Observable<Nationality> {
    return this.http.get<Nationality>(Constants.NATIONALITY_API + `/${id}`);
  }

  postData(data: Nationality): Observable<Nationality> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post<Nationality>(Constants.NATIONALITY_ADD_API, data, { headers })
      .pipe(
        tap(() => {
          this.cateNationalityUpdated.next();
        })
      );
  }

  deleteData(id: string): Observable<void> {
    return this.http.delete<void>(Constants.NATIONALITY_DELETE_API + id).pipe(
      tap(() => {
        this.cateNationalityUpdated.next();
      })
    );
  }

  updateData(data: any): Observable<Nationality> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .put<Nationality>(Constants.NATIONALITY_UPDATE_API + data.id, data, {
        headers,
      })
      .pipe(
        tap(() => {
          this.cateNationalityUpdated.next();
        })
      );
  }

  getNationalityUpdateListener(): Observable<void> {
    return this.cateNationalityUpdated.asObservable();
  }

  async getUserCountry(): Promise<string> {
    const response = await fetch(Constants.NATIONALITY_GET_COUNTRY_API);
    const jsonResponse = await response.json();
    console.log(jsonResponse.ip, jsonResponse.country);
    return jsonResponse.country;
  }
}
