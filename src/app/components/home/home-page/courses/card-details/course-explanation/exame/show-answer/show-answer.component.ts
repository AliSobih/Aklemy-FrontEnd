import { Component, Input, OnInit } from '@angular/core';
import { Answer } from '@common/answer';
import { PreventCopyPasteDirective } from '@common/directive/prevent-copy-paste.directive';
import { DragAndDrop } from '@common/drag-and-drop';
import { TranslateModule } from '@ngx-translate/core';
import { QuestionService } from '@services/question.service';

@Component({
  selector: 'app-show-answer',
  standalone: true,
  imports: [TranslateModule, PreventCopyPasteDirective],
  templateUrl: './show-answer.component.html',
  styleUrl: './show-answer.component.scss',
})
export class ShowAnswerComponent implements OnInit {
  @Input() id!: number;
  @Input() language!: string;
  correctAnswer: { answerDTOS: Answer[]; dragAndDropDTOS: DragAndDrop[] } = {
    answerDTOS: [],
    dragAndDropDTOS: [],
  };

  constructor(private questionService: QuestionService) {}
  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.questionService.getCorrectAnswers(this.id!).subscribe((data) => {
      this.correctAnswer = data;
    });
  }

  getHeader(): string {
    if (this.correctAnswer.answerDTOS) {
      return this.language === 'ar' ? 'الإجابات الصحيحة' : 'Correct Answer';
    } else if (this.correctAnswer.dragAndDropDTOS) {
      return this.language === 'ar'
        ? 'الإجابات الصحيحة للتوصيل'
        : 'Correct DragAndDrop';
    }
    return '';
  }

  getAnswer(answer: Answer): string {
    return this.language === 'ar' ? answer.answerAr : answer.answer;
  }

  getAnswerDescription(answer: Answer): string {
    return this.language === 'ar' ? answer.descriptionAr! : answer.description!;
  }

  getAnswerTitle(): string {
    return this.language === 'ar' ? 'الإجابة' : 'Answer';
  }

  getAnswerDescriptionTitle(): string {
    return this.language === 'ar' ? 'التعليق' : 'Description';
  }

  getDragTitle(): string {
    return this.language === 'ar' ? 'السؤال' : 'Question';
  }

  getDropTitle(): string {
    return this.language === 'ar' ? 'الإجابة' : 'Answer';
  }

  getDragAnswer(drag: DragAndDrop): string {
    return this.language === 'ar' ? drag.dragItemAr : drag.dragItem;
  }

  getDropAnswer(drag: DragAndDrop): string {
    return this.language === 'ar' ? drag.dropItemAr : drag.dropItem;
  }
}
