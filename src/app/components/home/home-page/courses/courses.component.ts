import { Course } from '@common/course';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FooterComponent } from '../../../core/footer/footer.component';
import { CourseService } from '../../../../services/course.service';
import { ShoppingCartService } from '../../../../services/shopping-cart.service';
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';
import { Constants } from '@common/constants';
import { ReviewComponent } from './review/review.component';
import { EnrollmentService } from '@services/enrollment.service';
import { Enrollment } from '@common/enrollment';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '@services/language.service';
import { SkeletonModule } from 'primeng/skeleton';
import { User } from '@common/user';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    MatPaginatorModule,
    CommonModule,
    CoursesComponent,
    ReviewComponent,
    TranslateModule,
    SkeletonModule,
  ],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.scss',
})
export class CoursesComponent implements OnInit, OnDestroy {
  @Input() courses: Course[] = [];
  totalCourses = 0;
  pageSize = 12; // Set default page size
  currentPage = 0;
  categoryId: number = 0;
  @Input() CourseId: number = 0;
  path = Constants.COURSE_DOWNLOAD_IMAGE_API;

  user: User = new User();

  subscription: Subscription | undefined;
  private languageSubscription: Subscription | undefined;

  private courseListSubscription?: Subscription;
  coursesLoaded: boolean = false;
  coursesError: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  language: string | null = null;

  constructor(
    private courseService: CourseService,
    private router: Router,
    private shoppingCartService: ShoppingCartService,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private enrollmentService: EnrollmentService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.loadData();
    this.subscription = this.courseService
      .getCoursesUpdateListener()
      .subscribe(() => {
        this.loadData();
      });
    this.courseService.courseSearshUpdated.subscribe((data) => {
      this.courses = data.data;

      this.totalCourses = data.totalQuestions;
      this.currentPage = data.currentPage;
      this.courses.forEach((course) => {
        this.loadImage(course);
      });
    });

    this.courseListSubscription = this.courseListSubscription =
      this.courseService.courseListUpdated.subscribe((categoryId: number) => {
        this.loadData(categoryId);
      });

    this.languageSubscription = this.languageService.languageChanged.subscribe(
      () => {
        this.language = this.languageService.getLanguage();
      }
    );
  }

  loadData(categoryId?: number) {
    if (categoryId != null && categoryId >= 0) {
      this.categoryId = categoryId;
      this.currentPage = 0;
    }
    this.coursesLoaded = false;
    this.coursesError = false;
    this.courseService
      .getCoursePages(this.pageSize, this.currentPage + 1, categoryId)
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
          this.coursesLoaded = false;
          this.coursesError = true;
        },
      });
  }
  viewCard(item: Course) {
    this.router.navigate(['home/details', item.id]);
  }
  addProductToCart(item: any) {
    if (item) {
      this.shoppingCartService.addProductToCart(item);
      Swal.fire({
        title: 'Good job!',
        text: 'You clicked the button!',
        icon: 'success',
      });
    }
  }

  enroll(item: Course) {
    if (item) {
      const enrollment = new Enrollment(
        item, // for course
        '', // for date
        this.user.id // for studentId --> for test
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

  getStars(rating: number): string[] {
    const totalStars = 5;
    const filledStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = totalStars - filledStars - (halfStar ? 1 : 0);

    return [
      ...Array(filledStars).fill('fas fa-star'), // نجوم ممتلئة
      ...(halfStar ? ['fas fa-star-half-alt'] : []), // نجمة نصف ممتلئة إذا كانت التقييم يحتوي على نصف
      ...Array(emptyStars).fill('far fa-star'), // نجوم فارغة
    ];
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.courseListSubscription?.unsubscribe();
    this.languageSubscription?.unsubscribe();
  }
}
