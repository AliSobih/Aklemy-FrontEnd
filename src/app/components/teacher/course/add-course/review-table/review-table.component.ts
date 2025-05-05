import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { Review } from '@common/review';
import { ReviewService } from '@services/review.service';
import { SkeletonModule } from 'primeng/skeleton';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-review-table',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule, SkeletonModule],
  templateUrl: './review-table.component.html',
  styleUrl: './review-table.component.scss',
})
export class ReviewTableComponent {
  reviewData: Review[] = [];
  private reviewSubscription?: Subscription;
  courseId?: any;
  totalReview = 0;
  pageSize = 20; // Set default page size
  currentPage = 0;



  constructor(
    private reviewService: ReviewService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        this.courseId = +params['id'];
        this.loadData();
      }
    });
    this.reviewSubscription = this.reviewService
      .getReviewUpdateListener()
      .subscribe(() => {
        this.loadData();
      });
  }

  loadData() {


     this.reviewService
       .getallData(this.courseId, this.currentPage + 1, this.pageSize)
       .subscribe({
         next: (data) => {
           this.reviewData = data.data;
           console.log('data', data.data);
           this.totalReview = data.totalCount;
           this.currentPage = data.currPage;
         },
         error: (error) => {

           console.error('Error fetching data:', error);
         },
       });
  }

  confirmDelete(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteData(id);
      }
    });
  }

  deleteData(id: any) {
    this.reviewService.deleteData(id).subscribe({
      next: (data) => {
        Swal.fire('Deleted!', 'Your item has been deleted.', 'success');
        this.loadData();
      },
      error: (error) => {
        console.error('Error deleting data:', error);
        Swal.fire('Error!', 'There was an error deleting the item.', 'error');
      },
    });
  }
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  ngOnDestroy(): void {
    this.reviewSubscription?.unsubscribe();
  }
}
