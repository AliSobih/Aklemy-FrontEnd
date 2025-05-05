import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Constants } from '@common/constants';
import { PreventCopyPasteDirective } from '@common/directive/prevent-copy-paste.directive';
import { User } from '@common/user';
import { UserExam } from '@common/user-exam';
import { UserExamQuestion } from '@common/user-exam-question';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '@services/language.service';
import { UserExameService } from '@services/user-exame.service';

@Component({
  selector: 'app-all-exam',
  standalone: true,
  imports: [TranslateModule, CommonModule, PreventCopyPasteDirective],
  templateUrl: './all-exam.component.html',
  styleUrl: './all-exam.component.scss',
})
export class AllExamComponent implements OnInit {
  questionList?: UserExamQuestion[] = [];
  data: any;
  @Input() examId!: number;
  language: string = 'en';
  @Input() tagged!: boolean;
  @Output() questionSelected = new EventEmitter<number>();
  user: User = new User();

  constructor(
    private userExameService: UserExameService,
    private lansguageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.language = this.lansguageService.getLanguage()!;

    this.loadData();
  }

  loadData() {
    this.userExameService
      .startExam({
        examId: this.examId,
        userId: this.user.id,
        language: this.language,
      })
      .subscribe({
        next: (data: UserExam) => {
          this.questionList = data.userExamQuestions;
          console.log('questionList', this.questionList);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
  hasMarkedAnswer(questions: UserExamQuestion[]): boolean {
    for (const question of questions) {
      if (question.userExamAnswers) {
        for (const answer of question.userExamAnswers) {
          if (answer.mark === true) {
            return true;
          }
        }
      } else if (question.userExamDragAndDrops) {
        for (const dragAndDrop of question.userExamDragAndDrops) {
          if (dragAndDrop.mark === true) {
            return true;
          }
        }
      }
    }
    return false;
  }

  getImagePath(imagePath: string) {
    return Constants.QUESTION_DOWNLOAD_IMAGE_API + imagePath;
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

  getDropItemText(dropItem: {
    randomDropItem: string;
    randomDropItemAr: string;
  }): string {
    return this.language === 'ar'
      ? dropItem.randomDropItemAr
      : dropItem.randomDropItem;
  }
  getEnglishLetter(index: number): string {
    if (this.language === 'en') {
      return String.fromCharCode(65 + index); // Convert index to ASCII (A, B, C, ...)
    } else {
      const arabicLetters = [
        'أ',
        'ب',
        'ت',
        'ث',
        'ج',
        'ح',
        'خ',
        'د',
        'ذ',
        'ر',
        'ز',
        'س',
        'ش',
        'ص',
        'ض',
        'ط',
        'ظ',
        'ع',
        'غ',
        'ف',
        'ق',
        'ك',
        'ل',
        'م',
        'ن',
        'ه',
        'و',
        'ي',
      ];
      return arabicLetters[index];
    }
  }

  selectQuestion(index: number) {
    this.questionSelected.emit(index);
  }
}
