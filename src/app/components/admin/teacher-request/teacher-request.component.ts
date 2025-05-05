import { TeacherRequest } from './../../../common/teacher-request';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { TeacherRequestService } from '@services/teacher-request.service';
import { SkeletonModule } from 'primeng/skeleton';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-teacher-request',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatPaginatorModule,
    SkeletonModule,
  ],
  templateUrl: './teacher-request.component.html',
  styleUrl: './teacher-request.component.scss',
})
export class TeacherRequestComponent implements OnInit {
  teacherRequest: TeacherRequest[] = [];
  totalTeacherRequest = 0;
  pageSize = 10; // Set default page size
  currentPage = 0;
  loaddata: boolean = false;
  loadError: boolean = false;

  loadingApprove: boolean = false;

  constructor(private teacherRequestService: TeacherRequestService) {}
  ngOnInit() {
    this.loadData();
  }
  loadData() {
    this.loaddata = false;
    this.loadError = false;
    this.teacherRequestService
      .getCoursePages(this.pageSize, this.currentPage + 1)
      .subscribe({
        next: (data) => {
          this.loaddata = true;
          this.teacherRequest = data.data;
          this.totalTeacherRequest = data.totalCount;
          this.currentPage = data.currPage;
        },
        error: (err) => {
          this.loaddata = false;
          this.loadError = true;
        },
      });
  }
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  onApprove(email: string, index: number) {
    this.loadingApprove = true;
    this.teacherRequestService.approve(email).subscribe({
      next: (data) => {
        this.teacherRequest.splice(index, 1);
        this.loadingApprove = false;
        Swal.fire({
          title: 'Good job!',
          text: 'Theacher Request Approved',
          icon: 'success',
        });
      },
      error: (eror) => {
        this.loadingApprove = false;
      },
    });
  }
}
