import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { FooterComponent } from '../../core/footer/footer.component';
import { HeaderComponent } from '../../core/header/header.component';
import { SlidarComponent } from './slidar/slidar.component';
import { Subscription } from 'rxjs';
import { Category } from '@common/category';
import { Course } from '@common/course';
import { CategoryService } from '@services/category.service';
import { CourseService } from '@services/course.service';
import { NationalityService } from '@services/nationality.service';
import { CoursesComponent } from './courses/courses.component';
import { ReviewService } from '@services/review.service';
import { Review } from '@common/review';
import { Router } from '@angular/router';
import { Constants } from '@common/constants';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '@services/language.service';
import { SkeletonModule } from 'primeng/skeleton';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { GalleriaModule } from 'primeng/galleria';
import $ from 'jquery';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    FooterComponent,
    MatPaginatorModule,
    CommonModule,
    CoursesComponent,
    HttpClientModule,
    HeaderComponent,
    SlidarComponent,
    NgbCarouselModule,
    TranslateModule,
    SkeletonModule,
    CarouselModule,
    ButtonModule,
    TagModule,
    GalleriaModule,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit, OnDestroy {
  Courses: Course[] = [];
  review?: Review[] = [];
  totalCourses = 0;
  pageSize = 10; // Set default page size
  currentPage = 0;
  // subscription: Subscription | undefined;
  categories: Category[] = [];
  responsiveOptions: any[] | undefined;

  categoryId: number = 0;
  userCountry: string | undefined;
  subscription: Subscription | undefined;
  private languageSubscription: Subscription | undefined;

  language: string | null = 'en';

  categoryImageUrl: string = Constants.CATEGORY_DOWNLOAD_IMAGE;

  loading: boolean = true;

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild('sliderRow') sliderRow!: ElementRef;
  @ViewChild('navSection') navSection: ElementRef | undefined;

  currentPosition = 0;
  cardWidth!: number;
  visibleCards = 4;

  constructor(
    private courseService: CourseService,
    private categoryService: CategoryService,
    private nationalityService: NationalityService,
    private reviewService: ReviewService,
    private router: Router,
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

    this.subscription = this.categoryService
      .getCategoriesUpdateListener()
      .subscribe(() => {
        this.loadData();
      });
    this.languageSubscription = this.languageService.languageChanged.subscribe(
      () => {
        this.language = this.languageService.getLanguage();
      }
    );
  }

  loadData(): void {
    this.courseService
      .getCoursePages(this.pageSize, this.currentPage + 1)
      .subscribe({
        next: (data) => {
          this.Courses = data.data;
          this.totalCourses = data.totalCount;
          this.currentPage = data.currPage;
          // this.loadReviews();
        },
        error: (error) => {},
      });
    this.reviewService.getAllReview().subscribe({
      next: (data) => {
        this.review = data;
      },
      error: (error) => {},
    });
    this.categoryService.getallData().subscribe((categories: Category[]) => {
      this.categories = categories;
    });
  }

  scrollToNavSection(): void {
    this.navSection!.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  viewCard(id: number): void {
    this.router.navigate(['home/details', id]);
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  onSelectCategory(categoryId: number): void {
    this.categoryId = categoryId;
    // this.loadData();
    this.courseService.courseListUpdated.next(categoryId);
  }

  onNavigateToCategory(category: Category) {
    this.router.navigate(['home', 'category-name', category.id]);
  }

  goToCTO() {
    this.router.navigate(['home', 'join-us']);
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

  getCategoryName(name: { name: string; nameAr: string }): string {
    return this.language === 'ar' ? name.nameAr : name.nameAr;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.languageSubscription?.unsubscribe();
  }
}
