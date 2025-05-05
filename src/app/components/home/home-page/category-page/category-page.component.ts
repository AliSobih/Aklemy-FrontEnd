import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '@common/category';
import { Course } from '@common/course';
import { Enrollment } from '@common/enrollment';
import { TranslateModule } from '@ngx-translate/core';
import { CategoryService } from '@services/category.service';
import { CourseService } from '@services/course.service';
import { EnrollmentService } from '@services/enrollment.service';
import { LanguageService } from '@services/language.service';
import { SkeletonModule } from 'primeng/skeleton';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { AddCourseComponent } from '../../../teacher/course/add-course/add-course.component';
import { CoursesComponent } from '../courses/courses.component';

@Component({
  selector: 'app-category-page',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    MatPaginatorModule,
    SkeletonModule,
    AddCourseComponent,
    CoursesComponent,
  ],
  templateUrl: './category-page.component.html',
  styleUrl: './category-page.component.scss',
})
export class CategoryPageComponent implements OnInit, OnDestroy {
  totalCourses = 0;
  pageSize = 10; // Set default page size
  currentPage = 0;
  courses: Course[] = [];
  category: Category | null = null;
  categoryId: number = 0;
  language: string = 'en';

  languageSubscription: Subscription | null = null;
  categorySubscription: Subscription | null = null;

  coursesLoaded: boolean = false;
  coursesError: boolean = false;

  constructor(
    private courseService: CourseService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private languageService: LanguageService,
    private sanitizer: DomSanitizer,

    private enrollmentService: EnrollmentService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.activatedRoute.params.subscribe((params) => {
      this.categoryId = params['id'];
      this.currentPage = 0;
      this.loadData();
    });

    // this.categoryId = this.activatedRoute.params.subscribe['id'];
    if (this.categoryId) {
      this.loadData();
    }

    this.languageSubscription = this.languageService.languageChanged.subscribe(
      () => {
        this.language = this.languageService.getLanguage();
      }
    );
  }

  loadData(): void {
    this.coursesLoaded = false;
    this.coursesError = false;
    this.courseService
      .getCoursePages(this.pageSize, this.currentPage + 1, this.categoryId)
      .subscribe({
        next: (data) => {
          this.coursesLoaded = true;
          this.courses = data.data;
          this.totalCourses = data.totalCount;
          this.currentPage = data.currPage;
          this.courses.forEach((course) => {
            this.loadImage(course);
          });
        },
        error: (error) => {
          this.coursesError = true;
        },
      });

    this.categorySubscription = this.categoryService
      .getCategoryById(this.categoryId)
      .subscribe((data) => {
        this.category = data;
      });
  }
  loadImage(course: Course) {
    if (course) {
      this.courseService.downloadImage(course.imageURL).subscribe({
        next: (imageBlob) => {
          const objectURL = URL.createObjectURL(imageBlob);
          course.imageDownload =
            this.sanitizer.bypassSecurityTrustUrl(objectURL);
        },
        error: (error) => {},
      });
    }
  }

  enroll(item: Course) {
    if (item) {
      const enrollment = new Enrollment(
        item, // for course
        '', // for date
        1 // for studentId --> for test
      );
      this.enrollmentService.enroll(enrollment).subscribe(
        () =>
          Swal.fire({
            title: 'Great Choice!',
            text: 'You enrolled to this Course!',
            icon: 'success',
          }),
        (error) => Swal.fire('Error', error, 'error')
      );
    }
  }

  viewCard(item: Course) {
    this.router.navigate(['home/details', item.id]);
  }

  getStars(rating: number): string[] {
    const totalStars = 5;
    const filledStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = totalStars - filledStars - (halfStar ? 1 : 0);

    return [
      ...Array(filledStars).fill('fas fa-star'),
      ...(halfStar ? ['fas fa-star-half-alt'] : []),
      ...Array(emptyStars).fill('far fa-star'),
    ];
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  ngOnDestroy(): void {
    if (this.languageSubscription !== null) {
      this.languageSubscription.unsubscribe();
    }
    if (this.categorySubscription !== null) {
      this.categorySubscription.unsubscribe();
    }
  }
}
