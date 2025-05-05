import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { Category } from '../common/category';
import { Constants } from '@common/constants';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private categoriesUpdated = new Subject<void>();

  constructor(private http: HttpClient) {}

  getallData(): Observable<Category[]> {
    console.log(Constants.CATEGORY_ALL_API);
    return this.http.get<Category[]>(Constants.CATEGORY_ALL_API);
  }
  postData(data: Category): Observable<Category> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
      .post<Category>(Constants.CATEGORY_ADD_API, data, { headers })
      .pipe(
        tap(() => {
          this.categoriesUpdated.next();
        })
      );
  }

  deleteData(id: Category): Observable<Category> {
    return this.http.delete<any>(Constants.CATEGORY_DELETE_API + id).pipe(
      tap(() => {
        this.categoriesUpdated.next();
      })
    );
  }

  updateData(data: Category): Observable<Category> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .put<Category>(Constants.CATEGORY_UPDATE_API + data.id, data, { headers })
      .pipe(
        tap(() => {
          this.categoriesUpdated.next();
        })
      );
  }

  getCategoryById(categoryId: number): Observable<Category> {
    return this.http.get<Category>(`${Constants.CATEGORY_API}/${categoryId}`);
  }

  getCategoriesUpdateListener(): Observable<void> {
    return this.categoriesUpdated.asObservable();
  }

  uploadImages(files: File[]): Observable<string> {
    const formData: FormData = new FormData();
    for (let file of files) {
      formData.append('file', file, file.name);
    }
    return this.http.post<string>(Constants.CATEGORY_UPLOAD_IMAGE, formData);
  }
}
