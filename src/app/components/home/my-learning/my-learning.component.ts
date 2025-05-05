import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Course } from '@common/course';
import { CourseService } from '@services/course.service';
import { ShoppingCartService } from '@services/shopping-cart.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { CoursesComponent } from '../home-page/courses/courses.component';
import { ReviewComponent } from '../home-page/courses/review/review.component';
import { Constants } from '@common/constants';
import { EnrollmentService } from '@services/enrollment.service';
import { User } from '@common/user';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '@services/language.service';

@Component({
  selector: 'app-my-learning',
  standalone: true,
  imports: [
    MatPaginatorModule,
    CommonModule,
    CoursesComponent,
    ReviewComponent,
    TranslateModule,
  ],
  templateUrl: './my-learning.component.html',
  styleUrl: './my-learning.component.scss',
})
export class MyLearningComponent implements OnInit, OnDestroy {
  courses: Course[] = [];
  totalCourses = 0;
  pageSize = 10; // Set default page size
  currentPage = 0;
  path = Constants.COURSE_DOWNLOAD_IMAGE_API;

  subscription: Subscription | undefined;
  private languageSubscription: Subscription | undefined;

  private courseListSubscription?: Subscription;
  private user: User = new User();

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  language: string | null = null;

  constructor(
    private router: Router,
    private shoppingCartService: ShoppingCartService,
    private enrollmentService: EnrollmentService,
    private languageService: LanguageService
  ) {}
  // ReviewComponent

  ngOnInit(): void {
    this.loadData();
    this.languageSubscription = this.languageService.languageChanged.subscribe(
      () => {
        this.language = this.languageService.getLanguage();
      }
    );
  }

 
  loadData() {
    this.enrollmentService
      .getEnrollmentByUserId(this.user.id, this.pageSize, this.currentPage + 1)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.courses = data.data;
          this.totalCourses = data.totalCount;
          this.currentPage = data.currPage;
        },
        error: (error) => {
          console.error('Error fetching data:', error);
        },
      });
  }
  viewCard(item: Course) {
    this.router.navigate(['home/course', item.id]);
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

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
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

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.courseListSubscription?.unsubscribe();
    this.languageSubscription?.unsubscribe();
  }
}
