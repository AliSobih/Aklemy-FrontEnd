import { Course } from './../../../../common/course';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../core/sidebar/sidebar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { CourseService } from '@services/course.service';
import { SkeletonModule } from 'primeng/skeleton';
import { SecondsToTimePipe } from "../../../../common/pipe/secods-to-time.pipe";
@Component({
  selector: 'app-details-course',
  standalone: true,
  templateUrl: './details-course.component.html',
  styleUrl: './details-course.component.scss',
  imports: [
    CommonModule,
    RouterModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    SidebarComponent,
    SkeletonModule,
    SecondsToTimePipe
],
})
export class DetailsCourseComponent implements OnInit, OnDestroy {
  Course: Course | null = null;
  courseId?: number;
  private CourseSupscription?: Subscription;
  panelOpenState = false;

  courseLoaded: boolean = false;
  courseError: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private courseService: CourseService,
    private router: Router,
    private activateRouter: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.courseId = params['id'];
    });
    this.loadData();
    this.CourseSupscription = this.courseService
      .getCoursesUpdateListener()
      .subscribe(() => {
        this.loadData();
      });
  }
  loadData(): void {
    this.courseLoaded = false;
    this.courseError = false;
    this.courseService.getCourseById(this.courseId!).subscribe(
      (data) => {
        this.Course = data;
        this.courseLoaded = true;
      },
      (error) => {
        this.courseError = true;
      }
    );
  }
  viewvideo(item: any) {
    if (this.router.url.includes('admin')) {
      this.router.navigate([item.id], {
        relativeTo: this.activateRouter,
      });
    } else {
      this.router.navigate(['teacher/video', this.courseId, item.id]);
    }
  }
  ngOnDestroy(): void {
    this.CourseSupscription?.unsubscribe();
  }
}
