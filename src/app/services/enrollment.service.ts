import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from '@common/constants';
import { PageRequest } from '@common/PageRequest';
import { Enrollment } from '@common/enrollment';
import { Observable, Subject, tap } from 'rxjs';
import { EnrollmentSearchRequestModel } from '@common/enrollmentSearchRequestModel';
import { Course } from '@common/course';

@Injectable({
  providedIn: 'root',
})
export class EnrollmentService {
  private enrollmentsUpdated = new Subject<void>();

  constructor(private http: HttpClient) {}

  getallData(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(Constants.ENROLLMENT_ALL_API);
  }

  searchEnrollments(
    pageNumber: number,
    pageSize: number,
    enrollmentRequestModel: EnrollmentSearchRequestModel
  ): Observable<PageRequest<Enrollment>> {
    return this.http.post<PageRequest<Enrollment>>(
      Constants.ENROLLMENT_SEARCH_API + pageNumber + '/' + pageSize,
      enrollmentRequestModel
    );
  }

  getByCourseIdAndUserId(courseId: number, userId: number): Observable<Course> {
    return this.http.get<Course>(
      `${Constants.ENROLLMENT_COURSE_BY_USER_ID}/${courseId}/${userId}`
    );
  }

  getEnrollmentsPage(
    pageSize: number,
    page: number
  ): Observable<PageRequest<Enrollment>> {
    return this.http.post<any>(Constants.ENROLLMENT_PAGE_API, {
      page: page,
      limit: pageSize,
    });
  }

  getEnrollmentByUserId(
    userId: number,
    pageSize: number,
    page: number
  ): Observable<PageRequest<Course>> {
    return this.http.post<PageRequest<Course>>(
      Constants.ENROLLMENT_ALL_BY_USER_ID_API + userId,
      {
        page: page,
        limit: pageSize,
      }
    );
  }

  enroll(data: Enrollment): Observable<Enrollment> {
    return this.http.post<Enrollment>(Constants.ENROLLMENT_ADD_API, data).pipe(
      tap(() => {
        this.enrollmentsUpdated.next();
      })
    );
  }

  approveEnrollment(enrollId: number): Observable<void> {
    return this.http.patch<void>(
      `${Constants.ENROLLMENT_APPROVE_ENROLMENT_API}/${enrollId}`,
      null
    );
  }

  getEnrollmentUpdateListener(): Observable<void> {
    return this.enrollmentsUpdated.asObservable();
  }
}
