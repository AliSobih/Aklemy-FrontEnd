import { ExamService } from './../../../../../services/exam.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Exam } from '@common/exam';
import { Question } from '@common/question';
import { QuestionSearchRequestDTO } from '@common/questionsearch';
import { QuestionService } from '@services/question.service';
import { Subject, Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-exam',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    MatPaginatorModule,
  ],
  templateUrl: './add-exam.component.html',
  styleUrl: './add-exam.component.scss',
})
export class AddExamComponent implements OnInit {
  examForm: FormGroup;
  questions: Question[] = [];
  selectedQuestions: Question[] = [];
  updetData?: Exam;
  courseId?: any;
  sectionId?: number;
  updeteExamId?: number;
  hasUnsavedChanges = false;
  isEditMode = false;
  totalQuestions = 0;
  pageSize = 10; // Set default page size
  currentPage = 0;
  searchValue: string = '';
  chapterValue: string = '';

  level: string = 'all';
  filter: QuestionSearchRequestDTO = new QuestionSearchRequestDTO();
  private questionsSubscription?: Subscription;
  private searchSubject = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private questionService: QuestionService,
    private examService: ExamService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.examForm = this.fb.group({
      examTitleArabic: ['', Validators.required],
      examTitleEnglish: ['', Validators.required],
      examDescriptionArabic: ['', Validators.required],
      examDescriptionEnglish: ['', Validators.required],
      time: [0, Validators.required],
      questionsNumber: [0, Validators.required],
      questions: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.courseId = +params['idCourse'];
      this.sectionId = +params['idExamSections'];
      this.updeteExamId = +params['idUpdetExam'];
      if (this.updeteExamId) {
        this.isEditMode = true;
        this.loadUpdeteData();
      }
    });
    this.loadCourseData();
  }

  loadCourseData(): void {
    this.filter.courseId = this.courseId;

    if (
      this.searchValue.trim() === '' &&
      this.level == 'all' &&
      this.chapterValue.trim() === ''
    ) {
      this.questionService
        .getQuestionPage(this.courseId, this.pageSize, this.currentPage + 1)
        .subscribe({
          next: (data) => {
            this.questions = data.data;
            this.totalQuestions = data.totalCount;
            this.currentPage = data.currPage;
          },
          error: (error) => {
            this.handleError(error, 'Error loading exam data');
          },
        });
    } else {
      this.filter.subject = this.searchValue;
      this.filter.level = this.level === 'all' ? undefined : this.level;
      this.filter.chapter = this.chapterValue;
      this.questionService
        .searchQuestion(this.currentPage + 1, this.pageSize, this.filter)
        .subscribe({
          next: (value) => {
            this.questions = value.data;
            this.totalQuestions = value.totalCount;
            this.currentPage = value.currPage - 1; // Adjusting because the service may return 1-based page index
          },
          error: (error) => {
            console.error('Error fetching data:', error);
          },
        });
    }
  }

  loadUpdeteData(): void {
    this.examService.getData(this.updeteExamId!).subscribe({
      next: (data) => {
        this.updetData = data;
        this.patchExamData(data);
      },
      error: (error) => {
        this.handleError(error, 'Error loading exam data');
      },
    });
  }

  patchExamData(data: any): void {
    this.examForm.patchValue({
      examTitleArabic: data.titleAr,
      examTitleEnglish: data.title,
      examDescriptionArabic: data.descriptionAr,
      examDescriptionEnglish: data.description,
      time: data.time/60,
    });
    this.selectedQuestions = data.questions;
    this.selectedQuestions.forEach((question) => {
      this.questionArray.push(this.fb.control(question.id));
    });
  }

  handleError(error: any, message: string): void {
    console.error(error);
    Swal.fire('Error', message, 'error');
  }

  get questionArray(): FormArray {
    return this.examForm.get('questions') as FormArray;
  }

  submitExamForm(): void {
    if (this.examForm.valid) {
      const formData = this.examForm.value;
      formData.courseId = this.courseId;
      formData.sectionId = this.sectionId;
      let timeN= formData.time * 60;
      const raq = {
        title: formData.examTitleEnglish,
        titleAr: formData.examTitleArabic,
        description: formData.examDescriptionEnglish,
        descriptionAr: formData.examDescriptionArabic,
        questionsNumber: formData.questionsNumber,
        time: timeN,
        questions: this.selectedQuestions,
        courseId: this.courseId,
        sectionId: this.sectionId,
        id: this.updetData?.id ? this.updetData?.id : undefined,
      };

      if (this.isEditMode) {
        this.updateExam(raq);
      } else {
        this.createExam(raq);
      }
    } else {
      this.examForm.markAllAsTouched();
    }
  }

  updateExam(exam: any): void {
    this.examService.updateData(exam).subscribe(
      () => {
        Swal.fire({
          title: 'Updated!',
          text: 'Exam has been updated. Do you want to exit?',
          icon: 'success',
          showCancelButton: true,
          confirmButtonText: 'Yes, exit',
          cancelButtonText: 'No, stay',
        }).then((result) => {
          if (result.isConfirmed) {
            this.hasUnsavedChanges = false;
            this.examForm.reset();
            if (this.router.url.includes('admin')) {
              this.router.navigate([`admin/courses/Exam/${this.courseId}`]);
            } else {
              this.router.navigate([`/teacher/Exam/${this.courseId}`]);
            }
          }
        });
      },
      (error) => this.handleError(error, 'Error updating exam')
    );
  }

  createExam(exam: any): void {
    this.examService.postData(exam).subscribe({
      next: () => {
        if (this.router.url.includes('admin')) {
          this.handleSuccess(
            'Exam has been added successfully',
            `admin/courses/Exam/${this.courseId}`
          );
        } else {
          this.handleSuccess(
            'Exam has been added successfully',
            `/teacher/Exam/${this.courseId}`
          );
        }
      },
      error: (error) => {
        this.handleError(error, 'Error adding exam');
      },
    });
  }

  handleSuccess(message: string, navigateTo: string): void {
    Swal.fire('Success', message, 'success').then(() => {
      this.examForm.reset();
      this.hasUnsavedChanges = false;
      if (navigateTo) {
        this.router.navigate([navigateTo]);
      }
    });
  }

  selectQuestion(question: Question): void {
    if (
      this.questionArray.controls.findIndex(
        (control) => control.value === question.id
      ) !== -1
    ) {
      Swal.fire(
        'Warning',
        'This question has already been selected.',
        'warning'
      );
    } else {
      this.questionArray.push(this.fb.control(question.id));
      this.selectedQuestions.push(question);
    }
  }

  removeSelectedQuestion(index: number): void {
    const removedQuestion = this.selectedQuestions.splice(index, 1)[0];
    this.questionArray.removeAt(index);

    // Check if the question is no longer selected
    if (
      this.questionArray.controls.findIndex(
        (control) => control.value === removedQuestion.id
      ) === -1
    ) {
      const hiddenQuestionIndex = this.questions.findIndex(
        (q) => q.id === removedQuestion.id
      );
      if (hiddenQuestionIndex !== -1) {
        // this.questions[hiddenQuestionIndex] = false;
      }
    }
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadCourseData();
  }

  search(event: Event): void {
    this.searchValue = (event.target as HTMLInputElement).value;
    this.currentPage = 0; // Reset to first page
    this.loadCourseData();
  }
  filterChapter(event: Event): void {
    this.chapterValue = (event.target as HTMLInputElement).value;
    this.currentPage = 0; // Reset to first page
    this.loadCourseData();
  }

  filterLevel(event: Event): void {
    if (this.level === 'all') {
      // this.level = null; // Here is the issue
    }
    this.level = (event.target as HTMLInputElement).value;
    this.currentPage = 0; // Reset to first page
    this.loadCourseData();
  }

  isQuestionSelected(question: Question): boolean {
    return this.selectedQuestions.some(
      (selected) => selected.id === question.id
    );
  }
}
