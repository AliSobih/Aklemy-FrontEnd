import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Course } from '@common/course';
import { CourseService } from '@services/course.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { SidebarComponent } from '@core/sidebar/sidebar.component';
import { Section } from '@common/section';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-add-exam',
  standalone: true,
  templateUrl: './exam.component.html',
  styleUrl: './exam.component.scss',
  imports: [
    CommonModule,
    RouterModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    SidebarComponent,
    SkeletonModule,
  ],
})
export class ExamComponent implements OnInit, OnDestroy {
  Course?: Course;
  @Output() courseId?: number;
  private CourseSupscription?: Subscription;
  panelOpenState = false;

  courseLoaded: boolean = false;
  courseError: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private courseService: CourseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.courseId = +params['id'];
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
  addquestion() {
    if (this.router.url.includes('admin')) {
      this.router.navigate(['admin/courses/addQuestion/', this.courseId]);
    } else {
      this.router.navigate(['teacher/addQuestion/', this.courseId]);
    }
  }
  addExamCourse() {
    if (this.router.url.includes('admin')) {
      this.router.navigate(['admin/courses/addExamCourse/', this.courseId]);
    } else {
      this.router.navigate(['teacher/addExamCourse/', this.courseId]);
    }
  }
  addExam(sections: Section) {
    if (this.router.url.includes('admin')) {
      this.router.navigate([
        'admin/courses/addExamSections/',
        this.courseId,
        sections.id,
      ]);
    } else {
      this.router.navigate([
        'teacher/addExamSections/',
        this.courseId,
        sections.id,
      ]);
    }
  }

  viewExamsections(sections: Section) {
    if (this.router.url.includes('admin')) {
      this.router.navigate([
        'admin/courses/viewExamSections/',
        this.courseId,
        sections.id,
      ]);
    } else {
      this.router.navigate([
        'teacher/viewExamSections/',
        this.courseId,
        sections.id,
      ]);
    }
  }

  viewQuestion() {
    if (this.router.url.includes('admin')) {
      this.router.navigate(['admin/courses/viewQuestion/', this.courseId]);
    } else {
      this.router.navigate(['teacher/viewQuestion/', this.courseId]);
    }
  }

  viewExamCourse() {
    if (this.router.url.includes('admin')) {
      this.router.navigate(['admin/courses/viewExamCourse/', this.courseId]);
    } else {
      this.router.navigate(['teacher/viewExamCourse/', this.courseId]);
    }
  }

  ngOnDestroy(): void {
    this.CourseSupscription?.unsubscribe();
  }
}
