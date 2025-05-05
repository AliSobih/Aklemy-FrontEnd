import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Exam } from '@common/exam';
import { ExamService } from '@services/exam.service';
import { SkeletonModule } from 'primeng/skeleton';

import { Subscription } from 'rxjs';
import { SecondsToTimePipe } from "../../../../../common/pipe/secods-to-time.pipe";

@Component({
  selector: 'app-view-exam',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatPaginatorModule,
    SkeletonModule,
    SecondsToTimePipe
],
  templateUrl: './view-exam.component.html',
  styleUrls: ['./view-exam.component.scss'],
})
export class ViewExamComponent implements OnInit {
  exams: Exam[] = [];
  oppning: boolean = false;
  selectedIndex: number | null = null;
  courseId!: number;
  sectionId?: number;
  totalExams = 0;
  pageSize = 10; // Set default page size
  currentPage = 0;

  examsLoaded: boolean = false;
  examsError: boolean = false;

  private examSubscription?: Subscription;

  constructor(
    private examService: ExamService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.courseId = +params['idCourse'];
      this.sectionId = params['idExamSections']
        ? +params['idExamSections']
        : undefined;
      this.loadexamData();
    });
    this.examSubscription = this.examService
      .getExamUpdateListener()
      .subscribe(() => {
        this.loadexamData();
      });
  }

  loadexamData() {
    this.examsLoaded = false;
    this.examsError = false;
    this.exams = [];
    if (this.sectionId) {
      this.examService
        .getExamsBySection(this.courseId, this.sectionId)
        .subscribe({
          next: (exams) => {
            this.exams = exams;
            this.examsLoaded = true;
          },
          error: (error) => {
            console.error(error);
            this.examsError = true;
          },
        });
    } else {
      this.examService
        .getExamPage(this.courseId, this.pageSize, this.currentPage + 1)
        .subscribe({
          next: (exams) => {
            this.examsLoaded = true;
            this.exams = exams.data;
            this.totalExams = exams.totalCount;
            this.currentPage = exams.currPage;
          },
          error: (error) => {
            console.error(error);
            this.examsError = true;
          },
        });
    }
  }
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadexamData();
  }

  updateExam(idExamSections: Exam) {
    if (this.sectionId) {
      if (this.router.url.includes('admin')) {
        this.router.navigate([
          'admin/courses/updeteExamSections/',
          this.courseId,
          this.sectionId,
          idExamSections.id,
        ]);
      } else {
        this.router.navigate([
          'teacher/updeteExamSections/',
          this.courseId,
          this.sectionId,
          idExamSections.id,
        ]);
      }
    } else {
      if (this.router.url.includes('admin')) {
        this.router.navigate([
          'admin/courses/updetExamCourse/',
          this.courseId,
          idExamSections.id,
        ]);
      } else {
        this.router.navigate([
          'teacher/updetExamCourse/',
          this.courseId,
          idExamSections.id,
        ]);
      }
    }
  }

  transformToTreeNodes(exams: Exam[]) {
    return exams.map((exam) => ({
      data: {
        id: exam.id,
        title: exam.title,
        titleAr: exam.titleAr,
        description: exam.description,
        descriptionAr: exam.descriptionAr,
        time: exam.time,
      },
      children: exam.questions.map((question) => ({
        data: {
          id: question.id,
          question: question.question,
        },
      })),
    }));
  }

  toggleQuestions(index: number) {
    if (this.selectedIndex === index) {
      this.oppning = !this.oppning;
    } else {
      this.selectedIndex = index;
      this.oppning = true;
    }
  }
}
