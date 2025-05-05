import { Course } from '@common/course';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CourseService } from '@services/course.service';
import { Subscription } from 'rxjs';
import { ExamService } from '@services/exam.service';
import { Section } from '@common/section';
import { Exam } from '@common/exam';
import { SidebarExamComponent } from '@core/sidebar-exam/sidebar-exam.component';
import { LanguageService } from '@services/language.service';
import { PreventCopyPasteDirective } from '@common/directive/prevent-copy-paste.directive';
@Component({
  selector: 'app-exam-table',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    SidebarExamComponent,
    PreventCopyPasteDirective,
  ],
  templateUrl: './exam-table.component.html',
  styleUrls: ['./exam-table.component.scss'],
})
export class ExamTableComponent implements OnInit, OnDestroy {
  course?: Course;
  exams: Exam[] = [];

  courseId: number | undefined;
  sectionId: number | undefined;
  panelOpenState = false;
  isSidebarHovered: boolean = false;

  courseSubscription?: Subscription;
  examsSubscription?: Subscription;
  pageSize = 10;
  currentPage = 0;
  totalExams = 0;

  language: string | null = null;

  isSidebarOpen: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private examService: ExamService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.activatedRoute.params.subscribe((params) => {
      this.courseId = +params['id'];
      this.sectionId = +params['idExamSections'];
      this.examsSubscription = this.examService
        .getAllExams(this.courseId)
        .subscribe((data: Exam[]) => {
          this.exams = data;
        });
    });

    this.language = this.languageService.getLanguage();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  switchLanguage() {
    console.log(this.language);
    if (this.language == 'ar') {
      this.languageService.setLanguage('en');
      this.language = 'en';
    } else {
      this.languageService.setLanguage('ar');
      this.language = 'ar';
    }
  }

  ngOnDestroy(): void {
    this.courseSubscription?.unsubscribe();
    if (this.examsSubscription) {
      this.examsSubscription.unsubscribe();
    }
  }
}
