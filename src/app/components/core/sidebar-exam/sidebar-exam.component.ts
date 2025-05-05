import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { Exam } from '@common/exam';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '@services/language.service';

@Component({
  selector: 'app-sidebar-exam',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, TranslateModule],
  templateUrl: './sidebar-exam.component.html',
  styleUrls: ['./sidebar-exam.component.scss'],
})
export class SidebarExamComponent implements OnChanges, OnInit {
  @Input() exam: Exam[] = [];
  @Input() courseId?: number;
  @Input() sectionId?: number;

  chapters: Exam[] = [];
  courseExams: Exam[] = [];

  language: string | null = null;

  constructor(
    private router: Router,
    private languageService: LanguageService
  ) {}
  ngOnInit(): void {
    this.language = this.languageService.getLanguage();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['exam'] && this.exam) {
      this.filterExams();
    }
  }

  filterExams(): void {
    this.chapters = this.exam.filter((item) => item.sectionId == null);
    this.courseExams = this.exam.filter((item) => item.sectionId != null);
  }

  examDetails(examId: number): void {
    if (this.sectionId) {
      this.router.navigate([
        `ExamSections/${this.courseId}/${this.sectionId}/exam`,
        examId,
      ]);
    } else {
      this.router.navigate([`courseExams/${this.courseId}/exam`, examId]);
    }
  }

  getExamTitle(examTitle: { examTitle: string; examTitleAr: string }): string {
    return this.language === 'ar' ? examTitle.examTitleAr : examTitle.examTitle;
  }
  activeIndex: number | null = null;

  toggleDropdown(index: number): void {
    this.activeIndex = this.activeIndex === index ? null : index;
  }

  goToHome() {
    this.router.navigate(['home']);
  }
}
