import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Constants } from '@common/constants';
import { Review } from '@common/review';
import { User } from '@common/user';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '@services/language.service';
import { ReviewService } from '@services/review.service';
import { Subscription } from 'rxjs';
import { RatingModule } from 'primeng/rating';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    TranslateModule,
    RatingModule,
  ],
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
})
export class ReviewComponent implements OnInit, OnDestroy {
  reviewData?: Review;

  reviewForm!: FormGroup;
  courseId: any;
  totalQuestions = 0;
  pageSize = 10; // Set default page size
  currentPage = 0;
  stars: number[] = [1, 2, 3, 4, 5];
  private user: User = new User();
  private languageSubscription: Subscription | undefined;
  language: string = 'en';

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService,
    private activatedRoute: ActivatedRoute,
    private languageService: LanguageService
  ) {
    this.reviewForm = this.fb.group({
      rating: [1, Validators.required],
      comment: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params['id']) {
        this.courseId = +params['id'];
        // this.loadData();
      }

      this.language = this.languageService.getLanguage();
    });

  }





onSubmit() {
  if (this.reviewForm.valid) {
    const data = this.reviewForm.value;
    const req = {
      courseId: this.courseId,
      userId: this.user.id, // Replace with actual user ID
      rating: data.rating,
      comment: data.comment,
    };
    console.log('req:', req);
    this.reviewService.postData(req).subscribe({
      next: (data) => {
        this.reviewForm.reset();
        this.reviewForm.patchValue({ rating: 1 }); // Reset the rating to default
        // اظهار الـ pop-up باستخدام Swal بعد نجاح الـ submit
        Swal.fire({
          icon: 'success',
          title: 'تم إرسال المراجعة بنجاح',
          showConfirmButton: false,
          timer: 1500
        });
        // this.loadData();
      },
      error: (error) => {
        console.error('Error posting data:', error);
        // اظهار رسالة خطأ في حالة الفشل
        Swal.fire({
          icon: 'error',
          title: 'حدث خطأ أثناء الإرسال',
          text: 'يرجى المحاولة مرة أخرى لاحقاً'
        });
      },
    });
  } else {
    console.error('Form is invalid');
    // اظهار رسالة خطأ في حالة عدم صحة البيانات
    Swal.fire({
      icon: 'error',
      title: 'خطأ في البيانات',
      text: 'يرجى التحقق من جميع الحقول المطلوبة'
    });
  }
}



  ngOnDestroy(): void {
    // Clean up subscriptions if necessary
    this.languageSubscription?.unsubscribe;
  }
}
