import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Question } from '@common/question';
import { QuestionSearchRequestDTO } from '@common/questionsearch';
import { QuestionService } from '@services/question.service';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-view-question',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatPaginatorModule,
    SkeletonModule,
  ],
  templateUrl: './view-question.component.html',
  styleUrls: ['./view-question.component.scss'],
})
export class ViewQuestionComponent implements OnInit {
  questions: Question[] = [];
  courseId?: number;
  oppning: boolean = false;
  selectedIndex: number | null = null;
  totalQuestions = 0;
  pageSize = 10; // Set default page size
  currentPage = 0;
  searchValue: string = '';
  chapterValue: string = '';

  level: string = 'all';
  filter: QuestionSearchRequestDTO = new QuestionSearchRequestDTO();

  questionLoaded: boolean = false;
  questionError: boolean = false;

  constructor(
    private questionService: QuestionService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.courseId = +params['id'];
      if (this.courseId) {
        this.loadData();
      }
    });
  }

  loadData(): void {
    this.filter.courseId = this.courseId;
    this.questionLoaded = false;
    this.questionError = false;
    if (
      this.searchValue.trim() === '' &&
      this.level == 'all' &&
      this.chapterValue.trim() === ''
    ) {
      this.questionService
        .getQuestionPage(this.courseId!, this.pageSize, this.currentPage + 1)
        .subscribe({
          next: (data) => {
            console.log(data);
            this.questionLoaded = true;
            this.questions = data.data;
            this.totalQuestions = data.totalCount;
            this.currentPage = data.currPage;
          },
          error: (error) => {
            console.error('Error fetching data:', error);
            this.questionError = true;
          },
        });
    } else {
      this.filter.subject = this.searchValue;
      this.filter.chapter = this.chapterValue;
      this.filter.level = this.level === 'all' ? undefined : this.level;
      this.questionService
        .searchQuestion(this.currentPage + 1, this.pageSize, this.filter)
        .subscribe({
          next: (value) => {
            this.questionLoaded = true;
            this.questions = value.data;
            this.totalQuestions = value.totalCount;
            this.currentPage = value.currPage - 1;
          },
          error: (error) => {
            this.questionError = true;
            console.error('Error fetching data:', error);
          },
        });
    }
  }

  updateQuestion(question: Question): void {
    if (this.router.url.includes('admin')) {
      this.router.navigate([
        'admin/courses/updeteQuestion/',
        this.courseId,
        question.id,
      ]);
    } else {
      this.router.navigate([
        'teacher/updeteQuestion/',
        this.courseId,
        question.id,
      ]);
    }
  }
  onPageChange(event: PageEvent): void {
    console.log(event);
    this.currentPage = event.pageIndex;


    this.pageSize = event.pageSize;
    this.loadData();
  }
  search(event: Event): void {
    this.searchValue = (event.target as HTMLInputElement).value;
    this.currentPage = 0; // Reset to first page
    this.loadData();
  }
  filterChapter(event: Event): void {
    this.chapterValue = (event.target as HTMLInputElement).value;
    this.currentPage = 0; // Reset to first page
    this.loadData();
  }

  filterLevel(event: Event): void {
    if (this.level === 'all') {
      // this.level = null; // Here is the issue
    }
    this.level = (event.target as HTMLInputElement).value;
    this.currentPage = 0; // Reset to first page
    this.loadData();
  }

  toggleAnswers(index: number): void {
    if (this.selectedIndex === index) {
      this.oppning = !this.oppning;
    } else {
      this.selectedIndex = index;
      this.oppning = true;
    }
  }
}
