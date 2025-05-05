import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, tap } from 'rxjs';
import { DescriptionMaster } from '../common/description-master';
import { CourseService } from './course.service';
import { Constants } from '@common/constants';

@Injectable({
  providedIn: 'root',
})
export class DescriptionMasterService {
  private descriptionMasterUpdated = new Subject<void>();
  private descriptionMasterDetails = new Subject<DescriptionMaster>();

  constructor(private http: HttpClient, private courseService: CourseService) {}

  getCourseAndEmit() {
    this.getallData().subscribe((data) => {
      this.descriptionMasterDetails.next(data);
    });
  }

  getallData(): Observable<DescriptionMaster> {
    return this.http.get<DescriptionMaster>(Constants.DESCRIPTION_MASTER_ALL_API);
  }

  getDescriptionMasterByCourseId(
    courseId: number
  ): Observable<DescriptionMaster[]> {
    return this.http.get<DescriptionMaster[]>(
      Constants.DESCRIPTION_MASTER_COURSE_API + courseId
    );
  }

  getData(id: number): Observable<DescriptionMaster> {
    return this.http.get<DescriptionMaster>(Constants.DESCRIPTION_MASTER_API + `/${id}`);
  }

  postData(data: any): Observable<DescriptionMaster> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post<DescriptionMaster>(Constants.DESCRIPTION_MASTER_ADD_API, data, { headers })
      .pipe(
        tap(() => {
          this.descriptionMasterUpdated.next();
          this.courseService.coursesUpdated.next();
        })
      );
  }

  deleteData(id: any): Observable<void> {
    return this.http.delete<void>(Constants.DESCRIPTION_MASTER_DELETE_API + id).pipe(
      tap(() => {
        this.descriptionMasterUpdated.next();
      })
    );
  }
  deletedetals(id: any): Observable<void> {
    return this.http
      .delete<void>(Constants.DESCRIPTION_DETAILS_DELETE_API + id)
      .pipe(
        tap(() => {
          this.descriptionMasterUpdated.next();
        })
      );
  }

  updateData(data: any): Observable<DescriptionMaster> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .put<DescriptionMaster>(Constants.DESCRIPTION_MASTER_UPDATE_API + data.id, data, {
        headers,
      })
      .pipe(
        tap(() => {
          this.descriptionMasterUpdated.next();
        })
      );
  }

  getdescriptionMastersUpdateListener(): Observable<void> {
    return this.descriptionMasterUpdated.asObservable();
  }
}
