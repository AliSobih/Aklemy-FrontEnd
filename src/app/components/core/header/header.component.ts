import { ShoppingCartService } from './../../../services/shopping-cart.service';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { Category } from '@common/category';
import { Course } from '@common/course';
import { SearchCourse } from '@common/search-course';
import { User } from '@common/user';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CategoryService } from '@services/category.service';
import { CourseService } from '@services/course.service';
import { EnrollmentService } from '@services/enrollment.service';
import { LanguageService } from '@services/language.service';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, TranslateModule, MatAutocompleteModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  courses: Course[] = [];
  coursesEnrollment: Course[] = [];
  categoryList: Category[] = [];
  cardlength: number = 0;
  searchValue: string = '';
  currentPage = 0;
  pageSize = 10;
  totalQuestions = 0;
  totalCoursesEnrollment = 0;
  currentPageEnrollment = 0;
  language: string = 'en';
  filter: SearchCourse = new SearchCourse();
  user: User = new User();
  items: any[] | undefined;
  selectedItem: any;
  suggestions: any[] | undefined;
  isSearchActive: boolean = false; // متغير للتحكم في حالة القائمة

  constructor(
    private router: Router,
    private courseService: CourseService,
    private categoryService: CategoryService,
    private enrollmentService: EnrollmentService,
    private sanitizer: DomSanitizer,
    private translate: TranslateService,
    private languageService: LanguageService,
    private elementRef: ElementRef // لإدارة النقرات خارج حقل البحث
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.loadCategories();
    this.language = this.languageService.getLanguage();
  }

  // استمع للنقرات على المستند
  @HostListener('document:click', ['$event'])
  handleClick(event: MouseEvent) {
    // إذا كانت النقرة خارج عنصر البحث، قم بإخفاء القائمة
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isSearchActive = false;
    }
  }

  searchs(event: AutoCompleteCompleteEvent) {
    this.suggestions = [...Array(10).keys()].map(
      (item) => event.query + '-' + item
    );
  }

  switchLanguage() {
    if (this.language == 'ar') {
      this.languageService.setLanguage('en');
      this.language = 'en';
    } else {
      this.languageService.setLanguage('ar');
      this.language = 'ar';
    }
  }

  loadCategories() {
    this.categoryService.getallData().subscribe((data) => {
      this.categoryList = data;
      this.loadData();
    });
  }

  onSelectCategory(categoryId: number) {
    this.courseService.courseListUpdated.next(categoryId);
  }

  loadData() {
    this.filter.searchValue = this.searchValue;
    this.courseService
      .search(this.currentPage + 1, this.pageSize, this.filter)
      .subscribe({
        next: (value) => {
          this.courses = value.data;
          this.totalQuestions = value.totalCount;
          this.currentPage = value.currPage - 1;
          this.courses.forEach((course) => {
            this.loadImage(course);
          });
        },
        error: (error) => {},
      });
    if (this.user.id != 0) {
      this.enrollmentService
        .getEnrollmentByUserId(
          this.user.id,
          this.pageSize,
          this.currentPageEnrollment + 1
        )
        .subscribe({
          next: (data) => {
            this.coursesEnrollment = data.data;
            this.totalCoursesEnrollment = data.totalCount;
            this.currentPageEnrollment = data.currPage;
            this.coursesEnrollment.forEach((course) => {
              this.loadImage(course);
            });
          },
          error: (error) => {},
        });
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

  viewCard(item: Course) {
    this.router.navigate(['home/course', item.id]);
  }
  login() {
    this.router.navigate(['login']);
  }
  signUp() {
    this.router.navigate(['sign-up']);
  }

  viewCardDetails(item: Course) {
    this.router.navigate(['home/details', item.id]);
    this.searchValue = ''; // تفريغ حقل البحث
    this.courses = []; // إخفاء النتائج الحالية بعد التفريغ
    this.isSearchActive = false; // إغلاق القائمة بعد النقر
  }

  openHome() {
    this.router.navigate(['home']);
  }

  onNavigateToCategory(category: Category) {
    this.router.navigate(['home', 'category-name', category.id]);
  }
  logout() {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('authUser');
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    window.location.reload();

    this.router.navigate(['home']);
  }

  search(event: Event): void {
    this.searchValue = (event.target as HTMLInputElement).value;
    this.currentPage = 0; // إعادة ضبط الصفحة الحالية
    this.isSearchActive = true; // إظهار القائمة عند بدء البحث
    this.loadData();
  }
}
