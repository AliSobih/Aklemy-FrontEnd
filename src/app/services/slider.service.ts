// slider.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { Slider } from '@common/slider';
import { Constants } from '@common/constants';

@Injectable({
  providedIn: 'root',
})
export class SliderService {
  public updateSliderList = new Subject<void>();

  constructor(private http: HttpClient) {}

  getAllAds(): Observable<Slider[]> {
    return this.http.get<Slider[]>(Constants.SLIDER_DOWNLOAD_ALL_IMAGE_API);
  }

  uploadImages(files: File[]): Observable<string> {
    const formData: FormData = new FormData();
    for (let file of files) {
      formData.append('files', file, file.name);
    }
    return this.http
      .post<string>(Constants.SLIDER_UPLOAD_IMAGE_API, formData)
      .pipe(tap(() => this.updateSliderList.next()));
  }

  deleteAd(id: number): Observable<string> {
    return this.http
      .delete<string>(`${Constants.SLIDER_DELETE_IMAGE_API}${id}`)
      .pipe(tap(() => this.updateSliderList.next()));
  }
}
