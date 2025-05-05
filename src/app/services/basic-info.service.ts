import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BasicInfo } from '@common/basic-info';
import { Constants } from '@common/constants';
import { Observable, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BasicInfoService {
  private BasicInfoUpdated = new Subject<void>();
  constructor(private http: HttpClient) {}

  gitbasicInfo(): Observable<BasicInfo[]> {
    return this.http.get<BasicInfo[]>(Constants.BASIC_INFO_ALL_API);
  }

  updateData(data: BasicInfo): Observable<BasicInfo> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .put<BasicInfo>(Constants.BASIC_INFO_UPDATE_API + data.id, data, {
        headers,
      })
      .pipe(
        tap(() => {
          this.BasicInfoUpdated.next();
        })
      );
  }

  postBasicInfo(data: BasicInfo): Observable<BasicInfo> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log('Data:', data);

    return this.http
      .post<BasicInfo>(Constants.BASIC_INFO_ADD_API, data, { headers })
      .pipe(
        tap(() => {
          this.BasicInfoUpdated.next();
        })
      );
  }
}
