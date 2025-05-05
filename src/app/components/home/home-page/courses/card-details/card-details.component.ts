import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { CoursePreviewComponent } from './course-preview/course-preview.component';
import { Course } from '@common/course';
import { DescriptionMaster } from '@common/description-master';
import { CourseService } from '@services/course.service';
import { DescriptionMasterService } from '@services/description-master.service';
import { ShoppingCartService } from '@services/shopping-cart.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FooterComponent } from '@core/footer/footer.component';

import { SecondsToTimePipe } from '@common/pipe/secods-to-time.pipe';
import { Constants } from '@common/constants';
import { ReviewComponent } from '../review/review.component';
import { ReviewService } from '@services/review.service';
import { Review } from '@common/review';
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '@services/language.service';
import { SkeletonModule } from 'primeng/skeleton';
import { CarouselModule } from 'primeng/carousel';
import { Enrollment } from '@common/enrollment';
import { EnrollmentService } from '@services/enrollment.service';
import Swal from 'sweetalert2';
import { AllReviewesComponent } from '../all-reviewes/all-reviewes.component';
import { CoursesComponent } from '../courses.component';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { CategoryService } from '@services/category.service';
import { Category } from '@common/category';

@Component({
  selector: 'app-card-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReviewComponent,
    TranslateModule,
    SecondsToTimePipe,
    FontAwesomeModule,

    CoursesComponent,
  ],
  templateUrl: './card-details.component.html',
  styleUrls: ['./card-details.component.scss'],
})
export class CardDetailsComponent implements OnInit, OnDestroy {
  course?: Course;
  reviewData: Review[] = [];
  panelOpenState = false;
  courseId?: any;
  courses: Course[] = [];
  totalRatings: number = 0;
  responsiveOptions: any;
  instrautorName: string = '';
  sectionCount: number = 0;
  lessonCount: number = 0;
  descriptionMasterList: DescriptionMaster[] = [];
  path = Constants.COURSE_DOWNLOAD_IMAGE_API;
  imageUrl: SafeUrl | undefined;
  private subscription?: Subscription;
  language: string = 'en';
  totalQuestions = 0;
  pageSize = 10; // Set default page size
  currentPage = 0;
  loaddata = false;
  loadError = false;
  loaddatadescription = false;
  loadErrordescription = false;
  loaddatareview = false;
  loadErrorreview = false;

  private languageSubscription: Subscription | undefined;
  @ViewChild('relatedCourses') relatedCourses!: ElementRef;
  @ViewChild('card') card!: ElementRef;
  category: Category | null = null;
  cardFixed: boolean = false;
  stopScroll: boolean = false;
  constructor(
    private activpop: NgbModal,
    private courseService: CourseService,
    private enrollmentService: EnrollmentService,
    private el: ElementRef,
    private renderer: Renderer2,
    private library: FaIconLibrary,
    private categoryService: CategoryService,
    private shoppingCartService: ShoppingCartService,
    private activatedRoute: ActivatedRoute,
    private descriptionMasterService: DescriptionMasterService,
    private reviewService: ReviewService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private languageService: LanguageService
  ) {
    library.addIcons(faStar, faStarHalfAlt, farStar);
  }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        this.courseId = params['id'];
        this.loadData();
      }
    });
    this.loadcourses();
    this.subscription = this.courseService
      .getCoursesUpdateListener()
      .subscribe(() => {
        this.loadData();
      });
    this.subscription = this.descriptionMasterService
      .getdescriptionMastersUpdateListener()
      .subscribe(() => {
        this.loadDatadescriptionMaster();
      });
    this.subscription = this.reviewService
      .getReviewUpdateListener()
      .subscribe(() => {
        this.loadData();
      });
    this.languageSubscription = this.languageService.languageChanged.subscribe(
      () => {
        this.language = this.languageService.getLanguage() ?? 'en';
      }
    );
    this.responsiveOptions = [
      {
        breakpoint: '1199px',
        numVisible: 3,
        numScroll: 1,
      },
      {
        breakpoint: '991px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }

  loadcourses() {
    this.courseService
      .getCoursePages(this.pageSize, this.currentPage + 1)
      .subscribe({
        next: (data) => {
          this.courses = data.data;
          this.currentPage = data.currPage;
          this.courses.forEach((course) => {
            this.loadImagee(course);
          });
        },
        error: (error) => {},
      });
  }
  loadImagee(course: Course) {
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

  getFirstHalf(details: any[]): any[] {
    const half = Math.ceil(details.length / 2);
    return details.slice(0, half);
  }

  getSecondHalf(details: any[]): any[] {
    const half = Math.ceil(details.length / 2);
    return details.slice(half);
  }
  activeIndex: number | null = null;

  toggleDropdown(index: number): void {
    this.activeIndex = this.activeIndex === index ? null : index;
  }

  loadData() {
    this.loaddata = false;
    this.loadError = false;
    this.courseService.getCourseById(this.courseId).subscribe({
      next: (data) => {
        this.loaddata = true;
        this.course = data;
        this.totalRatings =
          this.course?.ratingCounts?.reduce((acc, count) => acc + count, 0) ??
          0;

        this.categoryService
          .getCategoryById(this.course.categoryId)
          .subscribe((cate) => {
            this.category = cate;
          });
        this.courseService.courseDetails.next(data);
        this.calculateCounts();
        this.loadImage(this.course?.imageURL);
      },
      error: (error) => {
        this.loaddata = false;
        this.loadError = true;
      },
    });
    this.loadDatadescriptionMaster();
    this.loaddatareview = false;
    this.loadErrorreview = false;

    this.reviewService
      .getallData(this.courseId, this.currentPage + 1, this.pageSize)
      .subscribe({
        next: (data) => {
          this.loaddatareview = true;
          this.reviewData = data.data;
          this.totalQuestions = data.totalCount;
          this.currentPage = data.currPage;
        },
        error: (error) => {
          this.loaddatareview = false;
          this.loadErrorreview = true;
        },
      });
  }
  calculatePercentage(count: number): number {
    return (count / this.totalRatings) * 100;
  }
  loadDatadescriptionMaster(): void {
    this.loaddatadescription = false;
    this.loadErrordescription = false;
    this.descriptionMasterService
      .getDescriptionMasterByCourseId(this.courseId!)
      .subscribe({
        next: (data) => {
          this.loaddatadescription = true;
          this.descriptionMasterList = data;
        },
        error: (error) => {
          this.loaddatadescription = false;
          this.loadErrordescription = true;
        },
      });
  }

  loadImage(imageName: string | undefined) {
    if (imageName) {
      this.courseService.downloadImage(imageName).subscribe({
        next: (imageBlob) => {
          const objectURL = URL.createObjectURL(imageBlob);
          this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        },
        error: (error) => {},
      });
    }
  }

  calculateCounts() {
    this.sectionCount = this.course?.sections?.length || 0;
    this.lessonCount = 0;

    if (this.course?.sections) {
      this.course.sections.forEach((section: any) => {
        this.lessonCount += section.lessons?.length || 0;
      });
    }
  }
  getTotalDuration(lessons: any[]): number {
    let totalSeconds = 0;

    lessons.forEach((lesson) => {
      // التحقق مما إذا كانت قيمة lesson.duration صحيحة وليست 0 أو undefined
      if (
        lesson.duration &&
        lesson.duration !== '0' &&
        typeof lesson.duration === 'string'
      ) {
        const durationParts = lesson.duration.split(':'); // Assuming format "mm:ss" or "hh:mm:ss"
        let seconds = 0;

        if (durationParts.length === 2) {
          // "mm:ss" format
          seconds = +durationParts[0] * 60 + +durationParts[1];
        } else if (durationParts.length === 3) {
          // "hh:mm:ss" format
          seconds =
            +durationParts[0] * 3600 +
            +durationParts[1] * 60 +
            +durationParts[2];
        }

        totalSeconds += seconds;
      }
    });

    return totalSeconds; // Return total seconds to use with secondsToTime pipe
  }

  viewCoursePreview() {
    const res = this.activpop.open(CoursePreviewComponent);
    res.componentInstance.course = this.course;
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

  addProductToCart() {
    if (this.course) {
      this.shoppingCartService.addProductToCart(this.course);
    }
  }

  getStars(rating: number): any[] {
    const totalStars = 5;
    const filledStars = Math.floor(rating); // النجوم المملوءة
    const halfStar = rating % 1 !== 0; // نصف نجمة
    const emptyStars = totalStars - filledStars - (halfStar ? 1 : 0); // النجوم الفارغة

    // إرجاع الأيقونات الصحيحة
    return [
      ...Array(filledStars).fill(faStar), // نجوم مملوءة
      ...(halfStar ? [faStarHalfAlt] : []), // نصف نجمة إذا كانت موجودة
      ...Array(emptyStars).fill(farStar), // نجوم فارغة
    ];
  }
  scrollToSection(sectionId: string) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }
  viewReviewes() {
    const modalOptions: NgbModalOptions = {
      windowClass: 'custom-modal-dialog',
      size: 'xl',
    };
    const res = this.activpop.open(AllReviewesComponent, modalOptions);
    res.componentInstance.courseId = this.courseId;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.languageSubscription?.unsubscribe();
  }
}
