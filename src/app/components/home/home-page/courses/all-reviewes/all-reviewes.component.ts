import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Review } from '@common/review';
import { ReviewService } from '@services/review.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-all-reviewes',
  standalone: true,
  imports: [CommonModule, TranslateModule, SkeletonModule],
  templateUrl: './all-reviewes.component.html',
  styleUrls: ['./all-reviewes.component.scss'],
})
export class AllReviewesComponent implements OnInit {
  reviewData: Review[] = [];
  courseId?: any;
  paginatedReviews: Review[] = [];
  showMoreButton: boolean = true;

  reviewsPerPage: number = 3;
  totalQuestions = 0;
  pageSize = 10; // Set default page size
  currentPage = 0;
  totalPages: number | null = null;

  stars: number[] = [1, 2, 3, 4, 5];

  loaddata = false;
  loadError = false;

  constructor(
    private reviewService: ReviewService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loaddata = false;
    this.loadError = false;
    this.reviewService
      .getallData(this.courseId, this.currentPage + 1, this.pageSize)
      .subscribe({
        next: (data) => {
          this.loaddata = true;
          this.reviewData = [...this.reviewData, ...data.data];
          this.totalQuestions = data.totalCount;
          this.currentPage = data.currPage;
          if (this.totalPages === null) {
            this.totalPages = Math.ceil(this.totalQuestions / this.pageSize);
          }
        },
        error: (error) => {
          this.loaddata = false;
          this.loadError = true;
        },
      });
  }

  loadMore() {
    this.totalPages!--;
    this.loadData();
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

  switchLanguage(language: string) {
    this.translate.use(language);
  }

  ngOnDestroy(): void {}
}
