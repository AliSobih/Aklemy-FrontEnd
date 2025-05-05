import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Certificate } from '@common/certificate';
import { Constants } from '@common/constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CertificateService {
  constructor(private http: HttpClient) {}

  getUsercertificate(certificate: Certificate): Observable<any> {
    return this.http.post<any>(Constants.CERTIFICATE_USER_API, {
      courseId: certificate.courseId,
      studentId: certificate.studentId,});
  }
}
