import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Lesson } from '@common/lesson';
import { PageRequest } from '@common/PageRequest';
import { SearchCourse } from '@common/search-course';
import { SearchRequestModel } from '@common/SearchRequestModel';
import { Observable, Subject, tap } from 'rxjs';
import { Constants } from '../common/constants';
import { Course } from '../common/course';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private userCountry = sessionStorage.getItem('userCountry');
  public coursesUpdated = new Subject<void>();
  courseListUpdated = new Subject<number>();
  public courseSearshUpdated = new Subject<{
    data: Course[];
    totalQuestions: number;
    currentPage: number;
  }>();

  constructor(private http: HttpClient) {}

  courseDetails = new Subject<Course>();
  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(Constants.COURSE_ALL_API + this.userCountry);
  }

  getCourseById(id: any): Observable<Course> {
    return this.http.get<Course>(
      Constants.COURSE_API + `/${id}/${this.userCountry}`
    );
  }
  search(
    pageNumber: number,
    pageSize: number,
    search: SearchCourse
  ): Observable<PageRequest<Course>> {
    return this.http.post<PageRequest<Course>>(
      Constants.COURSE_SEARCH_API +
        pageNumber +
        '/' +
        pageSize +
        '/' +
        this.userCountry,
      search
    );
  }

  getCoursePages(
    pageSize: number,
    page: number,
    categoryId: number = 0
  ): Observable<PageRequest<Course>> {
    if (categoryId == 0) {
      return this.http.post<any>(
        `${Constants.COURSE_PAGE_API}${this.userCountry}`,
        {
          page: page,
          limit: pageSize,
        }
      );
    } else {
      return this.http.post<any>(
        `${Constants.COURSE_CATEGORY_API}${categoryId}/${this.userCountry}`,
        {
          page: page,
          limit: pageSize,
        }
      );
    }
  }

  filterCoursePages(
    pageSize: number,
    pageNumber: number,
    searchRequestModel: SearchRequestModel
  ): Observable<PageRequest<Course>> {
    return this.http.post<PageRequest<Course>>(
      Constants.COURSE_FILTER_API + pageNumber + '/' + pageSize,
      searchRequestModel
    );
  }

  addCourse(data: Course): Observable<Course> {
    return this.http.post<Course>(Constants.COURSE_ADD_API, data).pipe(
      tap(() => {
        this.coursesUpdated.next();
      })
    );
  }

  deleteCourse(id: number): Observable<Course> {
    return this.http.delete<Course>(Constants.COURSE_DELETE_API + id).pipe(
      tap(() => {
        this.coursesUpdated.next();
      })
    );
  }

  softDeleteeleteCourse(id: number): Observable<Course> {
    return this.http.delete<Course>(Constants.COURSE_SOFT_DELETE_API + id).pipe(
      tap(() => {
        this.coursesUpdated.next();
      })
    );
  }

  deleteSections(id: number): Observable<Selection> {
    return this.http.delete<Selection>(Constants.SECTION_DELETE_API + id).pipe(
      tap(() => {
        this.coursesUpdated.next();
      })
    );
  }
  deleteLesson(id: number): Observable<Lesson> {
    return this.http.delete<Lesson>(Constants.LESSON_DELETE_API + id).pipe(
      tap(() => {
        this.coursesUpdated.next();
      })
    );
  }

  updateCourse(data: Course): Observable<Course> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .put<any>(Constants.COURSE_UPDATE_API + data.id, data, { headers })
      .pipe(
        tap(() => {
          console.log(data);
          this.coursesUpdated.next();
        })
      );
  }

  getCoursesUpdateListener(): Observable<void> {
    return this.coursesUpdated.asObservable();
  }

  uploadPhoto(file: File): Observable<any> {
    const formData: FormData = new FormData();
    console.log(file.name);
    formData.append('files', file, file.name);
    console.log('formData');
    return this.http.post<any>(Constants.COURSE_UPLOAD_IMAGE_API, formData);
  }

  downloadImage(imageName: string): Observable<Blob> {
    return this.http.get(`${Constants.COURSE_DOWNLOAD_IMAGE_API}${imageName}`, {
      responseType: 'blob',
    });
  }
  downloadPdf(pdfName: string): Observable<Blob> {
    console.log(`${Constants.COURSE_DOWNLOAD_PDF_API}${pdfName}`);
    return this.http.get(`${Constants.COURSE_DOWNLOAD_PDF_API}${pdfName}`, {
      responseType: 'blob',
    });
  }

  // downloadVideo(videoName: string) {
  //   return this.http.get(Constants.COURSE_DOWNLOAD_VIDEO_API + videoName, {
  //     responseType: 'blob',
  //   });
  // }

  downloadVideo(videoName: string, range: string) {
    return this.http.get(Constants.COURSE_DOWNLOAD_VIDEO_API + videoName, {
      headers: new HttpHeaders({
        Range: range,
      }),
      responseType: 'blob',
    });
  }
}
