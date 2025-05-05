import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Course } from '../common/course';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  private courseSource = new BehaviorSubject<Course | null>(null);
  currentCourse = this.courseSource.asObservable();

  constructor() {}

  changeCourse(course: Course) {
    this.courseSource.next(course);
  }
}
