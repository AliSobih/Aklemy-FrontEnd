import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Constants } from '@common/constants';
import { Enrollment } from '@common/enrollment';
import { EnrollmentSearchRequestModel } from '@common/enrollmentSearchRequestModel';
import { User } from '@common/user';
import { SidebarComponent } from '@core/sidebar/sidebar.component';
import { EnrollmentService } from '@services/enrollment.service';
import { SkeletonModule } from 'primeng/skeleton';
import { Subscription } from 'rxjs';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-enrollments',
  standalone: true,
  imports: [
    SidebarComponent,
    CommonModule,
    FormsModule,
    MatPaginatorModule,
    SkeletonModule,
    InputSwitchModule,
  ],
  templateUrl: './enrollments.component.html',
  styleUrl: './enrollments.component.scss',
})
export class EnrollmentsComponent implements OnInit, OnDestroy {
  isSidebarHovered: boolean = false;
  enrollments: Enrollment[] = [];
  totalEnrollments = 0;
  pageSize = 10; // Set default page size
  currentPage = 0;
  searchValue: string = '';
  sortBy: string = 'enrollmentDate';
  fromDate?: Date | null;
  toDate?: Date | null = new Date();
  loaddata: boolean = false;
  loadError: boolean = false;
  private enrollmentsSubscription?: Subscription;
  enrollmentSearchModel: EnrollmentSearchRequestModel =
    new EnrollmentSearchRequestModel();
  private user: User = new User();

  constructor(private enrollmentService: EnrollmentService) {}

  ngOnInit(): void {
    const filter = new EnrollmentSearchRequestModel();
    this.getSearchData(this.currentPage + 1, this.pageSize, filter);
    this.enrollmentsSubscription = this.getSearchData(
      this.currentPage + 1,
      this.pageSize,
      filter
    );
  }

  onFromDateChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.fromDate = value ? new Date(value) : null;
    this.filterByDate();
  }

  onToDateChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.toDate = value ? new Date(value) : null;
    this.filterByDate();
  }

  filterByDate() {
    this.enrollmentSearchModel.searchValue = this.searchValue;
    this.enrollmentSearchModel.enrollmentDateFrom = this.fromDate;
    this.enrollmentSearchModel.enrollmentDateTo = this.toDate;
    this.getSearchData(1, this.pageSize, this.enrollmentSearchModel);
  }

  resetFilter() {
    this.fromDate = null;
    this.toDate = new Date();
    this.searchValue = '';
    this.currentPage = 0;
    this.pageSize = 10;
    const filter = new EnrollmentSearchRequestModel();
    this.getSearchData(1, this.pageSize, filter);
    this.enrollmentsSubscription = this.getSearchData(
      this.currentPage + 1,
      this.pageSize,
      filter
    );
  }

  search(event: Event) {
    this.searchValue = (event.target as HTMLInputElement).value;
    this.enrollmentSearchModel.searchValue = this.searchValue;
    this.getSearchData(
      this.currentPage,
      this.pageSize,
      this.enrollmentSearchModel
    );
  }

  getSearchData(
    currentPage: number,
    pageSize: number,
    enrollmentSearchModel: EnrollmentSearchRequestModel
  ) {
    enrollmentSearchModel.sortDirection = Constants.DESC;
    enrollmentSearchModel.sortBy = this.sortBy;
    enrollmentSearchModel.loggedInUserEmail = this.user.email;
    enrollmentSearchModel.isAdminUser = this.user.role === Constants.ROLE_ADMIN;
    this.loaddata = false;
    this.loadError = false;
    return this.enrollmentService
      .searchEnrollments(currentPage, pageSize, enrollmentSearchModel)
      .subscribe({
        next: (value) => {
          this.loaddata = true;
          this.enrollments = value.data;
          this.totalEnrollments = value.totalCount;
          this.currentPage = value.currPage;
        },
        error: (error) => {
          this.loaddata = false;
          this.loadError = true;
        },
      });
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.enrollmentSearchModel.searchValue = this.searchValue;
    this.enrollmentSearchModel.enrollmentDateFrom = this.fromDate;
    this.enrollmentSearchModel.enrollmentDateTo = this.toDate;

    this.getSearchData(
      this.currentPage + 1,
      this.pageSize,
      this.enrollmentSearchModel
    );
  }

  onSidebarHover() {
    this.isSidebarHovered = true;
  }

  onSidebarLeave() {
    this.isSidebarHovered = false;
  }

  onSwitchChange(id: number) {
    this.enrollmentService.approveEnrollment(id).subscribe(() => {});
  }

  ngOnDestroy(): void {
    this.enrollmentsSubscription?.unsubscribe();
  }
}
