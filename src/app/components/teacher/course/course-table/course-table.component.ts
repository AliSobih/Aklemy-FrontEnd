import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Course } from '@common/course';
import { CourseService } from '@services/course.service';
import { SkeletonModule } from 'primeng/skeleton';

import { SearchRequestModel } from '@common/SearchRequestModel';
import { Constants } from '@common/constants';
import { User } from '@common/user';

@Component({
  selector: 'app-course-table',
  standalone: true,
  imports: [RouterModule, MatPaginatorModule, CommonModule, SkeletonModule],
  templateUrl: './course-table.component.html',
  styleUrl: './course-table.component.scss',
})
export class CourseTableComponent implements OnInit, OnDestroy {
  Courses: Course[] = [];
  totalCourses = 0;
  pageSize = 10; // Set default page size
  currentPage = 0;

  coursesLoaded: boolean = false;
  coursesError: boolean = false;
  private user: User = new User();

  private coursesSubscription?: Subscription;

  constructor(
    private activpop: NgbModal,
    private courseService: CourseService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.coursesSubscription = this.courseService
      .getCoursesUpdateListener()
      .subscribe(() => {
        this.loadData();
      });
  }

  addCourse() {
    this.router.navigate(['add-course'], { relativeTo: this.activatedRoute });
  }

  loadData() {
    this.coursesLoaded = false;
    this.coursesError = false;
    let searchRequestModel = new SearchRequestModel();
    searchRequestModel.sortDirection = Constants.DESC;
    searchRequestModel.sortBy = 'title';
    searchRequestModel.loggedInUserEmail = this.user.email;
    searchRequestModel.isAdminUser = this.user.role === Constants.ROLE_ADMIN;
    this.courseService
      .filterCoursePages(
        this.pageSize,
        this.currentPage + 1,
        searchRequestModel
      )
      .subscribe({
        next: (data) => {
          this.coursesLoaded = true;
          this.Courses = data.data;
          this.totalCourses = data.totalCount;
          this.currentPage = data.currPage;
        },
        error: (error) => {
          this.coursesError = true;
          console.error('Error fetching data:', error);
        },
      });
  }

  deleteCourse(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this course!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        this.courseService.softDeleteeleteCourse(id).subscribe(() => {
          Swal.fire('Deleted!', 'The course has been deleted.', 'success');
          this.loadData();
        });
      }
    });
  }

  updateCourse(course: Course) {
    this.router.navigate(['update-course', course.id], {
      relativeTo: this.activatedRoute,
    });
  }
  addDescription_master(course: Course) {
    this.router.navigate(['description_master', course.id], {
      relativeTo: this.activatedRoute,
    });
  }
  addNationality(course: Course) {
    this.router.navigate(['nationality', course.id, course.price], {
      relativeTo: this.activatedRoute,
      // queryParams: { price: course.price },
      // state: { price: course.price },
    });
  }
  addCoupon(course: Course) {
    this.router.navigate(['coupon', course.id], {
      relativeTo: this.activatedRoute,
    });
  }

  viewCourse(course: Course) {
    this.router.navigate(['view-course', course.id], {
      relativeTo: this.activatedRoute,
    });
  }
  viewReview(course: Course) {
    this.router.navigate(['review-table', course.id], {
      relativeTo: this.activatedRoute,
    });
  }
  viewExam(course: Course) {
    this.router.navigate(['Exam', course.id], {
      relativeTo: this.activatedRoute,
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }
  ngOnDestroy(): void {
    this.coursesSubscription?.unsubscribe();
  }
}
