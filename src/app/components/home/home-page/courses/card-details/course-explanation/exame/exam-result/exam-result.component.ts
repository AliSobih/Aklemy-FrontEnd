import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from '@common/constants';
import { UserExam } from '@common/user-exam';
import { UserExamQuestion } from '@common/user-exam-question';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '@services/language.service';
import { UserExameService } from '@services/user-exame.service';
import { routes } from 'app/app.routes';
import { SkeletonModule } from 'primeng/skeleton';
import { SecondsToTimePipe } from "../../../../../../../../common/pipe/secods-to-time.pipe";
import { PreventCopyPasteDirective } from '@common/directive/prevent-copy-paste.directive';

@Component({
  selector: 'app-exam-result',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    SkeletonModule,
    SecondsToTimePipe,
    PreventCopyPasteDirective,
  ],
  templateUrl: './exam-result.component.html',
  styleUrl: './exam-result.component.scss',
})
export class ExamResultComponent implements OnInit {
  total: number | undefined;
  netTime: number | undefined;
  examId: number | undefined;
  isPass: boolean | undefined;
  showMyAnswers: boolean = false;
  userExam: UserExam | null = null;
  language: string | undefined;

  examLoaded: boolean = false;
  examError: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userExamService: UserExameService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.activatedRoute.params.subscribe((params) => {
      this.examLoaded = false;
      this.examError = false;
      this.examId = +params['examId'];
      this.userExamService.getExam(this.examId).subscribe(
        (data: UserExam) => {
          this.examLoaded = true;
          this.userExam = data;
          let totalNu =
            data.correctAnswers! / (data.correctAnswers! + data.wrongAnswers!);
          this.total = totalNu * 100;
          let totalTime = data.netTime;
          this.netTime = totalTime!;
          console.log('time', this.netTime);
          this.isPass = this.total >= 50;
        },
        (error) => {
          this.examError = true;
        }
      );
    });

    this.language = this.languageService.getLanguage()!;
  }

  showExamAnswers() {
    this.showMyAnswers = !this.showMyAnswers;
    console.log(this.userExam);
  }

  getImagePath(imagePath: string) {
    return Constants.QUESTION_DOWNLOAD_IMAGE_API + imagePath;
  }

  getUserExamTitle() {
    console.log(this.language);
    console.log(this.userExam?.titleAr);
    console.log(this.userExam?.title);
    return this.language === 'ar'
      ? this.userExam?.titleAr
      : this.userExam?.title;
  }

  getDescriptionText(description: {
    description: string;
    descriptionAr: string;
  }) {
    return this.language === 'ar'
      ? description.descriptionAr
      : description.description;
  }

  getQuestionText(question: UserExamQuestion): string {
    return this.language === 'ar'
      ? question.questionTextAr
      : question.questionText;
  }

  getAnswerText(answer: { answer: string; answerAr: string }): string {
    return this.language === 'ar' ? answer.answerAr : answer.answer;
  }

  getExamTitleText(title: { title: string; titleAr: string }): string {
    return this.language === 'ar' ? title.titleAr : title.title;
  }

  getDragItemText(dragItem: { dragItem: string; dragItemAr: string }): string {
    return this.language === 'ar' ? dragItem.dragItemAr : dragItem.dragItem;
  }

  getDraDropAnswerText(draDropItem: { answer: string; answerAr: string }) {
    return this.language === 'ar' ? draDropItem.answerAr : draDropItem.answer;
  }

  getDropItemText(dropItem: {
    randomDropItem: string;
    randomDropItemAr: string;
  }): string {
    return this.language === 'ar'
      ? dropItem.randomDropItemAr
      : dropItem.randomDropItem;
  }
}
