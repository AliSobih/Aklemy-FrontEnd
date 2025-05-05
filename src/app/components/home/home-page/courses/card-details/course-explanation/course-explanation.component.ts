import { Watch } from '@angular/core/primitives/signals';
import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  viewChild,
  ElementRef,
} from '@angular/core';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import {
  VgCoreModule,
  VgApiService,
  BitrateOptions,
} from '@videogular/ngx-videogular/core';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Course } from '@common/course';
import { SidebarComponent } from '@core/sidebar/sidebar.component';
import { Constants } from '@common/constants';
import { CourseService } from '@services/course.service';
import { SecondsToTimePipe } from '@common/pipe/secods-to-time.pipe';
import { ReviewService } from '@services/review.service';
import { Review } from '@common/review';
import { ReviewComponent } from '../../review/review.component';
import { Subscription } from 'rxjs';
import { PdfViewerComponent, PdfViewerModule } from 'ng2-pdf-viewer';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AllReviewesComponent } from '../../all-reviewes/all-reviewes.component';
import { CertificateComponent } from './certificate/certificate.component';
import { LanguageService } from '@services/language.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SidebarManuComponent } from '@core/sidebar-manu/sidebar-manu.component';
import { SkeletonModule } from 'primeng/skeleton';
import { Enrollment } from '@common/enrollment';
import Swal from 'sweetalert2';
import { EnrollmentService } from '@services/enrollment.service';
import { CarouselModule } from 'primeng/carousel';
import { DomSanitizer } from '@angular/platform-browser';
import { WatchedService } from '@services/watched.service';
import { User } from '@common/user';
import { CoursesComponent } from '../../courses.component';
import { Lesson } from '@common/lesson';
import { Section } from '@common/section';
import { CategoryService } from '@services/category.service';
import { Category } from '@common/category';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../../../../../../common/pipe/filter.pipe';
import { FooterComponent } from '../../../../../core/footer/footer.component';
import { HeaderComponent } from '../../../../../core/header/header.component';

@Component({
  selector: 'app-course-explanation',
  standalone: true,
  templateUrl: './course-explanation.component.html',
  styleUrls: ['./course-explanation.component.scss'],
  imports: [
    CommonModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    RouterModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    SidebarComponent,
    ReviewComponent,
    PdfViewerModule,
    CertificateComponent,
    TranslateModule,
    SidebarManuComponent,
    SkeletonModule,
    SecondsToTimePipe,
    CarouselModule,
    CoursesComponent,
    FormsModule,
    FilterPipe,
    FooterComponent,
    HeaderComponent,
  ],
})
export class CourseExplanationComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  reviewData: Review[] = [];
  paginatedReviews: Review[] = [];
  responsiveOptions: any[] | undefined;
  courses: Course[] = [];
  watches: { sectionId: number; watchedLessons: number }[] = [];
  searchResults: Lesson[] = [];
  course?: Course;
  category: Category | null = null;

  panelOpenState = false;
  isSidebarOpen = true;
  showMoreButton: boolean = true;
  isSidebarHovered: boolean = false;
  showExamContent = false;

  api!: VgApiService;
  courseId?: any;
  sectionCount: number = 0;
  lessonCount: number = 0;
  reviewsPerPage: number = 3;
  zoomLevel: number = 1;
  totalQuestions = 0;
  yourProgress: number = 0;
  pageSize = 4; // Set default page size
  currentPage = 0;

  path = Constants.COURSE_DOWNLOAD_VIDEO_API;
  instrautorName: string = '';
  usrName: string = '';
  currentContentSrc: string = '';
  currentContentType: string = '';
  currenSectionsTitle: string = '';
  currenSectionsTitleAr: string = '';
  currenLessonTitle: string = '';
  currenLessonTitleAr: string = '';
  language: string = 'en';
  searchTerm: string = '';

  vgDash: any;

  private courseSubscription: Subscription | undefined;
  private reviewSubscription: Subscription | undefined;
  private languageSubscription: Subscription | undefined;
  private videoSubscription: Subscription | null = null;
  private user: User = new User();

  @ViewChild('media') media: any;
  @ViewChild('toggleSidebarBtn') toggleSidebarBtn!: ElementRef;
  @ViewChild('contentVadeo') contentVadeo!: ElementRef;
  @ViewChild('sidebarContent') sidebarContent!: ElementRef;
  @ViewChild(PdfViewerComponent)
  private pdfComponent!: PdfViewerComponent;

  constructor(
    private router: Router,
    private activpop: NgbModal,
    private reviewService: ReviewService,
    private courseService: CourseService,
    private sanitizer: DomSanitizer,
    private watchedService: WatchedService,
    private activatedRoute: ActivatedRoute,
    private languageService: LanguageService,
    private enrollmentService: EnrollmentService
  ) {}

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        this.courseId = params['id'];
        this.loadData();
        this.loadReview();
      }
    });
    this.courseService
      .getCoursePages(this.pageSize, this.currentPage + 1)
      .subscribe({
        next: (data) => {
          this.courses = data.data;
          this.currentPage = data.currPage;
          this.courses.forEach((course) => {
            this.loadImage(course);
          });
        },
        error: (error) => {},
      });
    this.initializeSidebarToggle();
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

    this.courseSubscription = this.courseService.coursesUpdated.subscribe(
      () => {
        this.loadData();
      }
    );
    this.reviewSubscription = this.reviewService
      .getReviewUpdateListener()
      .subscribe(() => {
        this.loadReview();
      });

    this.languageSubscription = this.languageService.languageChanged.subscribe(
      () => {
        this.language = this.languageService.getLanguage() ?? 'en';
      }
    );
  }
  showVideo(): void {
    this.showExamContent = true; // يخفي محتوى الامتحانات ويعرض الفيديو
    // this.initializeSidebarToggle();
    this.loadData();
  }

  ngAfterViewInit(): void {
    // this.initializeSidebarToggle();

    setTimeout(() => {
      document
        .getElementById('videoSection')
        ?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  }
  initializeSidebarToggle(): void {
    const toggleSidebarBtn = document.getElementById(
      'toggleSidebarBtn'
    ) as HTMLElement;
    const sidebar = document.getElementById('sidebar') as HTMLElement;
    const content = document.getElementById('content') as HTMLElement;

    if (toggleSidebarBtn && sidebar && content) {
      toggleSidebarBtn.addEventListener('click', () => {
        sidebar.classList.toggle('hidden');
        content.classList.toggle('full-width');
      });
    }
  }

  loadData() {
    this.enrollmentService
      .getByCourseIdAndUserId(this.courseId, this.user.id)
      .subscribe({
        next: (data) => {
          this.course = data;
          this.watchedService
            .getWatchCorse(this.courseId, this.user.id)
            .subscribe((data) => {
              this.watches = data;
              this.yourProgress = data.reduce(
                (
                  sum: number,
                  item: { sectionId: number; watchedLessons: number }
                ) => sum + item.watchedLessons,
                0
              );
            });
          this.calculateCounts();
          this.courseService.courseDetails.next(data);
          this.playFirstContent();
        },
        error: (error) => {},
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

  loadReview() {
    this.reviewService
      .getallData(this.courseId, this.currentPage + 1, this.pageSize)
      .subscribe({
        next: (data) => {
          this.reviewData = data.data;
          this.usrName = data.data.userName;
        },
        error: (error) => {},
      });
  }

  showMoreReviews(): void {
    this.paginatedReviews = this.reviewData;
    this.showMoreButton = false;
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  onPlayerSet(api: VgApiService): void {
    this.api = api;
    const media = this.api.getDefaultMedia();
    media.subscriptions.loadedMetadata.subscribe(this.startVideo.bind(this));
    media.subscriptions.ended.subscribe(this.nextContent.bind(this));
  }

  nextContent(): void {
    // Add your logic here
  }
  numberOfWatches(sectionIndex: number) {
    return this.watches.find((item) => item.sectionId == sectionIndex)
      ?.watchedLessons;
  }

  startVideo(): void {
    this.api.play();
  }

  selectLesson(section: Section, lesson: Lesson) {
    if (lesson.watched == false && section.id && lesson.id) {
      this.postWatched(section.id, lesson.id);
      lesson.watched = true;
    }
    this.playContent(
      lesson.contentURL,
      lesson.contentType,
      lesson.title,
      section.title,
      lesson.titleAr,
      section.titleAr
    );
  }

  playContent(
    contentURL: string,
    contentType: any,
    lessonTitle?: string,
    sectionTitle?: string,
    lessonTitleAr?: string,
    sectionTitleAr?: string
  ): void {
    if (!contentURL) return;
    if (this.videoSubscription !== null) {
      this.videoSubscription.unsubscribe();
    }

    this.currentContentSrc = contentURL;
    this.currentContentType = contentType;
    this.currenLessonTitle = lessonTitle ?? '';
    this.currenSectionsTitle = sectionTitle ?? '';
    this.currenLessonTitleAr = lessonTitleAr ?? '';
    this.currenSectionsTitleAr = sectionTitleAr ?? '';

    if (contentType.includes('video') && !!this.api) {
      const media = this.api.getDefaultMedia();
      if (media) {
        media.pause();
        this.media.nativeElement.src = this.path + contentURL;
        this.media.nativeElement.load();
        this.media.nativeElement.oncanplay = () => {
          media.play();
        };
        // this.api.getDefaultMedia().subscriptions.timeUpdate.subscribe(() => {
        //   const currentTime = this.api.getDefaultMedia().currentTime;
        //   const range = `bytes=${currentTime * 1000},${
        //     (currentTime + 20) * 1000
        //   }`;
        //   this.videoSubscription = this.courseService
        //     .downloadVideo(this.currentContentSrc, range)
        //     .subscribe(
        //       (blob) => {
        //         const url = window.URL.createObjectURL(blob);
        //         this.media.nativeElement.src = url;
        //         this.media.nativeElement.oncanplay = () => {
        //           media.play();
        //         };
        //       },
        //       (error) => {
        //       }
        //     );
        // });
      }
    } else if (contentType.includes('pdf') && !!this.api) {
      this.media.nativeElement.src = '';
      this.currentContentSrc = this.path + this.currentContentSrc;
    }
  }

  playFirstContent(): void {
    if (this.course?.sections?.length && this.api) {
      const firstSection = this.course.sections[0];
      if (firstSection.lessons?.length > 0) {
        const firstLesson = firstSection.lessons[0];
        firstLesson.watched = true;
        this.postWatched(firstSection.id!, firstLesson.id!);
        this.playContent(
          firstLesson.contentURL,
          firstLesson.contentType.includes('video') ? 'video' : 'pdf',
          firstLesson.title,
          firstSection.title,
          firstLesson.titleAr,
          firstSection.titleAr
        );
        if (firstLesson.contentType.includes('video')) {
          this.startVideo();
        }
      }
    }
  }

  downloadPDF() {
    this.courseService.downloadPdf(this.currentContentSrc).subscribe(() => {});
  }

  playNextContent(): void {
    if (!this.course || !this.api) {
      return;
    }

    let currentSectionIndex = -1;
    let currentLessonIndex = -1;

    // Extract the filename from the URL for comparison
    const extractFileName = (url: string) => url.split('/').pop();

    // البحث عن الدرس الحالي
    for (let i = 0; i < this.course.sections.length; i++) {
      const section = this.course.sections[i];
      for (let j = 0; j < section.lessons.length; j++) {
        if (
          extractFileName(section.lessons[j].contentURL) ===
          extractFileName(this.currentContentSrc)
        ) {
          currentSectionIndex = i;
          currentLessonIndex = j;
          if (
            !this.course.sections[currentSectionIndex].lessons[
              currentLessonIndex
            ].watched
          ) {
            this.postWatched(
              this.course.sections[currentSectionIndex].id!,
              this.course.sections[currentSectionIndex].lessons[
                currentLessonIndex
              ].id!
            );
            this.course.sections[currentSectionIndex].lessons[
              currentLessonIndex
            ].watched = true;
          }

          break;
        }
      }
      if (currentSectionIndex !== -1) break;
    }

    // التأكد من العثور على الدرس الحالي
    if (currentSectionIndex !== -1 && currentLessonIndex !== -1) {
      const section = this.course.sections[currentSectionIndex];
      if (currentLessonIndex < section.lessons.length - 1) {
        const nextLesson = section.lessons[currentLessonIndex + 1];
        this.playContent(
          nextLesson.contentURL,
          nextLesson.contentType as 'video' | 'pdf',
          nextLesson.title,
          section.title,
          nextLesson.titleAr,
          section.titleAr
        );
      } else if (currentSectionIndex < this.course.sections.length - 1) {
        const nextSection = this.course.sections[currentSectionIndex + 1];
        if (nextSection.lessons.length) {
          const nextLesson = nextSection.lessons[0];
          this.playContent(
            nextLesson.contentURL,
            nextLesson.contentType as 'video' | 'pdf',
            nextLesson.title,
            section.title,
            nextLesson.titleAr,
            section.titleAr
          );
        } else {
        }
      } else {
      }
    } else {
    }
  }

  playPreviousContent(): void {
    if (!this.course || !this.api) return;

    let currentSectionIndex = -1;
    let currentLessonIndex = -1;

    // Extract the filename from the URL for comparison
    const extractFileName = (url: string) => url.split('/').pop();

    // العثور على الدرس الحالي
    for (let i = 0; i < this.course.sections.length; i++) {
      const section = this.course.sections[i];
      for (let j = 0; j < section.lessons.length; j++) {
        if (
          extractFileName(section.lessons[j].contentURL) ===
          extractFileName(this.currentContentSrc)
        ) {
          currentSectionIndex = i;
          currentLessonIndex = j;
          break;
        }
      }
      if (currentSectionIndex !== -1) break;
    }

    // التأكد من العثور على الدرس الحالي
    if (currentSectionIndex !== -1 && currentLessonIndex !== -1) {
      const section = this.course.sections[currentSectionIndex];

      // إذا كان الدرس الحالي ليس الأول في القسم
      if (currentLessonIndex > 0) {
        const previousLesson = section.lessons[currentLessonIndex - 1];
        if (previousLesson && previousLesson.contentURL) {
          this.playContent(
            previousLesson.contentURL,
            previousLesson.contentType.includes('video') ? 'video' : 'pdf',
            previousLesson.title,
            section.title,
            previousLesson.titleAr,
            section.titleAr
          );
        } else {
        }
      }
      // إذا كان الدرس الحالي هو الأول في القسم والعودة إلى الدرس الأخير من القسم السابق
      else if (currentSectionIndex > 0) {
        const previousSection = this.course.sections[currentSectionIndex - 1];
        if (previousSection.lessons.length) {
          const previousLesson =
            previousSection.lessons[previousSection.lessons.length - 1];
          if (previousLesson && previousLesson.contentURL) {
            this.playContent(
              previousLesson.contentURL,
              previousLesson.contentType.includes('video') ? 'video' : 'pdf',
              previousLesson.title,
              section.title,
              previousLesson.titleAr,
              section.titleAr
            );
          } else {
            console.error(
              'Previous lesson or contentURL is undefined in the previous section'
            );
          }
        } else {
          console.error('Previous section has no lessons');
        }
      }
    } else {
      console.error('Current section or lesson index not found');
    }
  }

  downloadContent(videoName: string) {
    const filename = videoName.split('/').pop();
    if (filename) {
      this.courseService.downloadPdf(filename).subscribe({
        next: (data) => {
          // Convert the data to a Blob if it's not already
          const blob = new Blob([data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          document.body.appendChild(link); // Append to the body
          link.click(); // Trigger the download
          document.body.removeChild(link); // Clean up
          window.URL.revokeObjectURL(url); // Free up memory
        },
        error: (err) => {
          console.error('Download failed', err);
        },
      });
    } else {
      console.error('Invalid filename');
    }
  }

  postWatched(sectionId: number, lessonId: number) {
    const watch = {
      userId: this.user.id,
      lessonId: lessonId,
      courseId: +this.courseId,
      sectionId: sectionId,
    };
    const foundItem = this.watches.find((item) => item.sectionId === sectionId);
    if (foundItem) {
      foundItem.watchedLessons++;
    }
    this.watchedService.postData(watch).subscribe({
      next: (data) => {
        console.log('whached');
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      },
    });
  }

  viewReviewes() {
    const modalOptions: NgbModalOptions = {
      windowClass: 'custom-modal-dialog',
      size: 'xl',
    };
    const res = this.activpop.open(AllReviewesComponent, modalOptions);
    res.componentInstance.courseId = this.courseId;
  }

  rewind(): void {
    const media = this.api.getDefaultMedia();
    media.currentTime = Math.max(media.currentTime - 10, 0);
  }

  skip(): void {
    const media = this.api.getDefaultMedia();
    media.currentTime = Math.min(media.currentTime + 10, media.duration);
  }

  changeQuality(event: BitrateOptions): void {
    this.vgDash.setBitrate(event);
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
  viewExam() {
    this.router.navigate(['/courseExams', this.courseId]);
  }
  viewExamSections(id: number) {
    this.router.navigate(['/ExamSections', this.courseId, id]);
  }
  gocertificate() {
    this.router.navigate(['home/course/', this.courseId, 'certificate']);
  }

  onSidebarHover() {
    this.isSidebarHovered = true;
  }

  onSidebarLeave() {
    this.isSidebarHovered = false;
  }

  search(event: KeyboardEvent): void {
    const searchValue = (event.target as HTMLInputElement).value;
    console.log(searchValue);
    const results: Lesson[] = [];
    if (searchValue.trim().length == 0) {
      return;
    }
    if (this.language == 'en') {
      this.course?.sections.forEach((section) => {
        section.lessons.forEach((lesson) => {
          if (lesson.title.toLowerCase().includes(searchValue.toLowerCase())) {
            results.push(lesson);
          }
        });
      });
    } else {
      this.course?.sections.forEach((section) => {
        section.lessons.forEach((lesson) => {
          if (lesson.titleAr.includes(searchValue)) {
            results.push(lesson);
          }
        });
      });
    }

    this.searchResults = results.slice(0, 4); // Limit to top 4 results
    console.log(this.searchResults);
  }

  activeIndex: number | null = null;

  toggleDropdown(index: number): void {
    this.activeIndex = this.activeIndex === index ? null : index;
  }

  enroll(item: Course) {
    if (item) {
      const enrollment = new Enrollment(item, '', this.user.id);
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
  calculateCounts() {
    this.sectionCount = this.course?.sections?.length || 0;
    this.lessonCount = 0;

    if (this.course?.sections) {
      this.course.sections.forEach((section: any) => {
        this.lessonCount += section.lessons?.length || 0;
      });
    }
  }
  trackByFn(index: number, item: any): any {
    return item.id; // استخدم معرفًا فريدًا لكل عنصر لتتبع العناصر
  }
  filteredLessons: any[] = [];

  filterLessons(searchTerm: string) {
    this.filteredLessons = [];

    if (this.course?.sections) {
      this.course.sections.forEach((section) => {
        const filtered = section.lessons.filter((lesson) =>
          lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filtered.length > 0) {
          this.filteredLessons.push({
            ...section,
            lessons: filtered,
          });
        }
      });
    }
  }

  viewCard(item: Course) {
    this.router.navigate(['home/details', item.id]);
  }
  ngOnDestroy(): void {
    if (this.courseSubscription) {
      this.courseSubscription.unsubscribe();
    }
    if (this.reviewSubscription) {
      this.reviewSubscription.unsubscribe();
    }
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
    if (this.videoSubscription !== null) {
      this.videoSubscription.unsubscribe();
    }
  }
}
