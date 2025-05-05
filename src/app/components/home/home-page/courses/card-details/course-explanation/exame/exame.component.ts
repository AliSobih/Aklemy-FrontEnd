import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Exam } from '@common/exam';
import { Question } from '@common/question';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '@services/exam.service';
import { UserExameService } from '@services/user-exame.service';
import { UserExam } from '@common/user-exam';
import { UserExamQuestion } from '@common/user-exam-question';
import { UserExamDragAndDrop } from '@common/user-exam-drag-and-drop';
import { UserExamDragAndDropAnswerDTO } from '@common/user-exam-drag-and-drop-answer-dto';
import { DragAndDrop } from '@common/drag-and-drop';
import { Answer } from '@common/answer';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ShowAnswerComponent } from './show-answer/show-answer.component';
import { Constants } from '@common/constants';
import { AllExamComponent } from './all-exam/all-exam.component';
import { User } from '@common/user';
import { Alphabet } from '@common/alphabet.enum';
import { ArabicAlphabet } from '@common/arabic-alphabet.enum';
import { LanguageService } from '@services/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';
import { DragDropModule } from 'primeng/dragdrop';
import { UserExamQuestionService } from '@services/user-exam-question.service';
import { SecondsToTimePipe } from '../../../../../../../common/pipe/secods-to-time.pipe';
import { PreventCopyPasteDirective } from '@common/directive/prevent-copy-paste.directive';

@Component({
  selector: 'app-exame',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    TranslateModule,
    SkeletonModule,
    DragDropModule,
    SecondsToTimePipe,
   PreventCopyPasteDirective,
  ],
  templateUrl: './exame.component.html',
  styleUrls: ['./exame.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ExameComponent implements OnInit, OnDestroy {
  exam: Exam | undefined;
  question: Question | undefined;
  questionForm: FormGroup | null = null;
  // courseId: string | null = null;
  // sectionId: string | null = null;
  questionIndex: number = 0;
  nextDisable: boolean = true;
  language: string = 'en';
  // answerList: { id: number | undefined; answers: { id: number }[] }[] = [];
  userExame: UserExam | undefined;
  isStartExam: boolean = false;
  userExameQuestions: UserExamQuestion[] = [];
  userQuestion: UserExamQuestion | undefined;
  languageSelected: boolean = false;
  selectedQuestionId: number | null = null;
  // selectedAnswers: { [key: number]: string } = {};

  // questionColors: { [key: number]: string } = {};
  checkedBox: boolean = false;
  examAnswers: number[] = [];
  examId: number | undefined;

  sectionId?: number;
  courseId?: number;
  answersList: Answer[] = [];
  dragAndDrop: UserExamDragAndDrop[] = [];
  answerDragAndDrop: UserExamDragAndDropAnswerDTO[] = [];
  dragAndDropFlag: number = 0;
  startComponent: boolean = true;
  showAnswer: boolean = false;
  tag: boolean = false;
  tagAdd: boolean = false;

  remainingTime: number = 0;
  intervalId: any;

  progress: number = 0;
  progressIncrement: number = 0;
  pause: boolean = false;

  imagePreview: string | ArrayBuffer | null = null;
  user: User = new User();

  letters: string[] | null = null;
  arabicLetters: string[] | null = null;

  examLoaded: boolean = false;
  examError: boolean = false;

  questionLoaded: boolean = false;
  questionError: boolean = false;

  dragItems: UserExamDragAndDrop[] = [];

  deopItems: UserExamDragAndDrop[] | undefined;

  dropItems: UserExamDragAndDrop[] = [];

  draggedItem: UserExamDragAndDrop | undefined | null;
  currentDate: Date | null = null;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userExameService: UserExameService,
    private activePop: NgbModal,
    private lansguageService: LanguageService,
    private userExamQuestionService: UserExamQuestionService,
    private examService: ExamService
  ) {}

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.language = this.lansguageService.getLanguage()!;
    this.activatedRoute.parent?.params.subscribe((params) => {
      this.courseId = +params['id'];
      this.sectionId = +params['idExamSections'];
    });

    this.activatedRoute.params.subscribe((params) => {
      if (params['examId']) {
        this.examService.getExamById(+params['examId']).subscribe((data) => {
          this.exam = data;
          console.log('exam id:', this.exam);
          this.currentDate = new Date();
        });
      }
      if (this.intervalId) {
        clearInterval(this.intervalId);
        let time = this.remainingTime;
        this.userExameService.pauseExam(this.examId!, time).subscribe(() => {
          this.intervalId = null;
          this.pause = false;
          this.isStartExam = false;
          this.examId = +params['examId'];
          this.questionIndex = 0;
          this.progress = 0;
          this.nextDisable = true;
          this.startComponent = true;
        });
      } else {
        this.intervalId = null;
        this.pause = false;
        this.isStartExam = false;
        this.questionIndex = 0;
        this.progress = 0;
        this.examId = +params['examId'];
        this.nextDisable = true;
        this.startComponent = true;
      }
    });

    this.initializeForm();
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

  initializeForm(): void {
    this.questionForm = this.fb.group({
      answer: [null],
      answers: this.fb.array([]),
    });
  }

  startExam() {
    this.isStartExam = true;
    this.examLoaded = false;
    this.examError = false;
    this.userExameService
      .startExam({
        examId: this.examId,
        userId: this.user.id,
        language: this.language,
      })
      .subscribe({
        next: (data: UserExam) => {
          this.examLoaded = true;
          this.userExame = data;
          this.examId = data.id;
          console.log('exam Id', this.examId);
          console.log(this.userExame);
          this.userExameQuestions = this.userExame.userExamQuestions!;
          this.progressIncrement = 100 / this.userExameQuestions.length;
          this.setQuestion(this.questionIndex);
          this.startTimer(this.userExame.remainingTime!);
        },
        error: (error) => {
          console.error(error);
          this.examError = true;
        },
      });
  }

  previous() {
    if (this.questionIndex > 0 && !this.pause) {
      this.progress -= this.progressIncrement;
      this.questionIndex--;
      this.setQuestion(this.questionIndex);
    }
  }

  setQuestion(index: number): void {
    this.userQuestion = this.userExameQuestions[index];
    this.tag = this.userQuestion.tag!;

    this.showAnswer = false;

    this.questionLoaded = false;
    this.questionError = false;

    if (!!this.userQuestion.imagePath) {
      this.imagePreview =
        Constants.QUESTION_DOWNLOAD_IMAGE_API + this.userQuestion.imagePath;
    } else {
      this.imagePreview = null;
    }
    if (this.userQuestion?.status === 'SINGLE') {
      this.singleAnswer(this.userQuestion.id);
    } else if (this.userQuestion?.status === 'MULTIPLE') {
      this.multpleAnswers(this.userQuestion.id);
    } else if (this.userQuestion?.status === 'DRAG_DROP') {
      this.dragAndDropAnswers(this.userQuestion.id);
    }
  }

  singleAnswer(id: number) {
    this.questionForm = this.fb.group({
      answer: [null],
    });
    this.answersList = [];
    this.userExameService.getCorrectAnswers(id).subscribe({
      next: (data: Answer[]) => {
        this.questionLoaded = true;
        this.answersList = data;
        // console.log(this.answersList);
        console.log('first');
        const item = this.answersList.find((item) => item.mark === true);
        console.log(item);
        if (this.startComponent && (item != null || item != undefined)) {
          this.updateProgress(this.progressIncrement);
          this.questionIndex++;
          this.setQuestion(this.questionIndex);
        } else if (this.startComponent) {
          this.startComponent = false;
          console.log('item', !!item);
          console.log(item);
        } else {
          this.questionForm = this.fb.group({
            answer: [!item ? null : item.id],
          });
        }
      },
      error: (error) => {
        this.questionError = true;
        console.error(error);
      },
    });
  }

  multpleAnswers(id: number) {
    this.questionForm = this.fb.group({
      answers: this.fb.array([]),
    });
    this.answersList = [];
    this.userExameService.getCorrectAnswers(id).subscribe({
      next: (data: Answer[]) => {
        this.questionLoaded = true;
        this.answersList = data;
        this.questionForm = this.fb.group({
          answers: this.fb.array(
            data.map((data) => {
              if (data.mark) {
                this.checkedBox = true;
              }
              return new FormControl(data.mark ? data.id : false);
            })
          ),
        });

        if (this.startComponent && this.checkedBox) {
          this.updateProgress(this.progressIncrement);
          this.checkedBox = false;
          this.questionIndex++;
          this.setQuestion(this.questionIndex);
        } else if (this.startComponent) {
          this.startComponent = false;
        }
        console.log('multaple ', data);
        console.log(this.questionForm);
      },
      error: (error) => {
        console.error(error);
        this.questionError = true;
      },
    });
  }

  dragAndDropAnswers(id: number) {
    this.userExameService.getCorrectDragAndDrop(id).subscribe({
      next: (data: DragAndDrop[]) => {
        this.questionLoaded = true;
        this.dragAndDrop = data;

        if (this.startComponent && !!this.dragAndDrop[0].answer) {
          this.updateProgress(this.progressIncrement);
          this.dragAndDrop = [];
          this.questionIndex++;
          this.setQuestion(this.questionIndex);
        } else if (this.startComponent) {
          this.startComponent = false;
        }

        this.dragItems = this.dragAndDrop.filter(
          (item) =>
            !this.dragAndDrop.some(
              (otherItem) => item.randomDropItem === otherItem.answer
            )
        );
        this.dropItems = this.dragAndDrop.slice();
      },
      error: (error) => {
        console.error(error);
        this.questionError = true;
      },
    });
  }

  onCheckboxChange(answerId: number, event: Event): void {
    console.log('change');
    const formArray: FormArray = this.questionForm!.get('answers') as FormArray;
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      formArray.controls[parseInt(checkbox.id.replace('answer', ''))].setValue(
        answerId
      );
    } else {
      formArray.controls[parseInt(checkbox.id.replace('answer', ''))].setValue(
        false
      );
    }

    const answers = this.questionForm?.value.answers;
    console.log(answers);
    if (
      answers.length ===
      answers.filter((data: boolean) => data === false).length
    ) {
      this.checkedBox = false;
    } else {
      this.checkedBox = true;
    }
  }

  toggleCheckbox(answerId: number, event: Event): void {
    const checkbox = (event.currentTarget as HTMLElement).querySelector(
      'input[type="checkbox"]'
    ) as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = !checkbox.checked;
      this.onCheckboxChange(answerId, { target: checkbox } as unknown as Event);
    }
  }

  next(): void {
    if (this.questionIndex < this.userExameQuestions.length - 1) {
      this.updateProgress(this.progressIncrement);
      this.questionIndex++;
      this.setQuestion(this.questionIndex);
    }
  }

  onSelectAnswer(answerId: number): void {
    this.questionForm!.controls['answer'].setValue(answerId);
    console.log(this.questionForm!.controls['answer'].value);
  }

  toggleTag() {
    if (this.userExameQuestions) {
      const question = this.userExameQuestions[this.questionIndex];
      const tagAction = question.tag
        ? this.userExamQuestionService.untagQuestion(question.id)
        : this.userExamQuestionService.tagQuestion(question.id);
      console.log('tag', question.tag);
      this.tagAdd = question.tag!;

      tagAction.subscribe(() => {
        question.tag = !question.tag;
        this.tag = question.tag;
      });
    }
  }

  onSubmit(): void {
    if (this.userQuestion?.status === 'MULTIPLE') {
      this.examAnswers = this.questionForm?.value.answers.filter(
        (data: number) => data >= 1
      );
    } else if (this.userQuestion?.status === 'SINGLE') {
      this.examAnswers = [+this.questionForm?.value.answer];
    } else if (this.userQuestion?.status === 'DRAG_DROP') {
      this.answerDragAndDrop = [];
      this.dropItems.forEach((item) => {
        this.answerDragAndDrop.push({
          userExamDragAndDropId: item.id!,
          answer: item.answer!,
          answerAr: item.answerAr!,
        });
      });
      console.log(this.answerDragAndDrop);
      this.userExameService.markDragAndDrops(this.answerDragAndDrop).subscribe({
        next: (data) => {
          this.answerDragAndDrop = [];
          this.dragItems = [];
          this.dropItems = [];
          // this.selectedAnswers = [];
          // this.questionColors = {};
          if (this.questionIndex === this.userExameQuestions.length - 1) {
            this.markExam();
          } else {
            this.next();
          }
        },
        error: (error) => {
          console.error(error);
        },
      });
    }
    if (
      this.userQuestion?.status === 'MULTIPLE' ||
      this.userQuestion?.status === 'SINGLE'
    ) {
      console.log(this.examAnswers);
      if (
        this.userExameQuestions[this.questionIndex].tag &&
        (this.examAnswers.length == 0 || this.examAnswers[0] == 0)
      ) {
        this.next();
        return;
      }
      this.userExameService.markAnswers(this.examAnswers).subscribe({
        next: (data) => {
          this.checkedBox = false;
          if (this.questionIndex === this.userExameQuestions.length - 1) {
            this.markExam();
          } else {
            this.next();
          }
        },
        error: (error) => {
          console.error(error);
        },
      });
    }
    if (this.questionIndex === this.userExameQuestions.length - 1) {
    }
  }

  markExam() {
    this.userExameService
      .pauseExam(this.examId!, this.remainingTime)
      .subscribe(() => {
        this.userExameService.markExam(this.examId!).subscribe({
          next: (data: UserExam) => {
            if (
              data?.correctAnswers != null &&
              data?.correctAnswers != null &&
              data?.wrongAnswers != null
            ) {
              let total =
                data.correctAnswers! /
                (data.correctAnswers! + data.wrongAnswers!);

              if (this.sectionId) {
                this.router.navigate([
                  `ExamSections/${this.courseId}/${this.sectionId}/result/${this.examId}`,
                  total * 100,
                ]);
              } else {
                this.router.navigate([
                  `courseExams/${this.courseId}/result/${total * 100}/${
                    this.examId
                  }`,
                ]);
              }
            }
          },
          error: (error) => {
            console.error(error);
          },
        });
      });
  }
  openShowAllExamQuestion(tagged: boolean) {
    const modalOptions: NgbModalOptions = {
      windowClass: 'custom-modal-dialog',
      size: 'xl',
    };
    const modelRef = this.activePop.open(AllExamComponent, modalOptions);
    this.activatedRoute.params.subscribe((params) => {
      modelRef.componentInstance.examId = +params['examId'];
    });
    modelRef.componentInstance.language = this.language;
    modelRef.componentInstance.tagged = tagged;

    modelRef.componentInstance.questionSelected.subscribe((index: number) => {
      this.questionIndex = index;
      this.setQuestion(index);
      modelRef.close();
    });
  }

  openShowAnswer() {
    const modalOptions: NgbModalOptions = {
      windowClass: 'custom-modal-dialog',
      size: 'xl',
    };
    const modelRef = this.activePop.open(ShowAnswerComponent, modalOptions);
    modelRef.componentInstance.id = this.userQuestion?.questionId;
    modelRef.componentInstance.language = this.language;
    console.log('show answer', this.showAnswer);
    this.showAnswer = !this.showAnswer;
    if (this.userQuestion?.status === 'SINGLE') {
      const item = this.answersList.find((data) => data.isCorrect === true);
      if (item !== undefined && this.showAnswer) {
        this.onSelectAnswer(item.id!);
      } else {
        this.questionForm?.patchValue({
          answer: null,
        });
      }
    } else if (this.userQuestion?.status === 'MULTIPLE') {
      if (this.showAnswer) {
        const checkBoxAnswers: any = this.answersList.map((data) => {
          if (data.isCorrect) {
            return data.id;
          } else {
            return false;
          }
        });
        console.log(checkBoxAnswers);
        this.questionForm = this.fb.group({
          answers: this.fb.array([...checkBoxAnswers]),
        });
        this.checkedBox = true;
      } else {
        this.questionForm = this.fb.group({
          answers: this.fb.array([false, false, false, false]),
        });
        this.checkedBox = false;
      }
    }
    console.log(this.questionForm?.value);
  }

  pauseTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      let time = this.remainingTime;
      console.log('Original time in minutes:', time);

      // if (time < 0) {
      //   if (time % 1 <= -0.5) {
      //     time = Math.floor(time);
      //   } else {
      //     time = Math.ceil(time);
      //   }
      // } else {
      //   if (time % 1 >= 0.5) {
      //     time = Math.ceil(time);
      //   } else {
      //     time = Math.floor(time);
      //   }
      // }

      console.log('Adjusted time in minutes:', time);

      this.userExameService.pauseExam(this.examId!, time).subscribe(() => {});
      this.intervalId = null;
      this.pause = true;
    } else {
      this.startTimer(this.remainingTime);
      this.pause = false;
    }
  }

  isNextDisabled(): boolean {
    if (this.tag) {
      return false;
    } else {
      if (this.userQuestion?.status === 'SINGLE') {
        // console.log(!this.questionForm?.get('answer')?.value || !this.pause);
        return !this.questionForm?.get('answer')?.value || this.pause;
      } else if (this.userQuestion?.status === 'MULTIPLE') {
        // console.log(!this.checkedBox || !this.pause);
        return !this.checkedBox || this.pause;
      } else if (this.userQuestion?.status === 'DRAG_DROP') {
        let numberOfAnswers: number = this.dropItems.filter(
          (item) => item.answer
        ).length;

        return numberOfAnswers !== this.dragAndDrop.length || this.pause;
      }
    }
    return true;
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

  dragStart(dragItem: UserExamDragAndDrop) {
    this.draggedItem = dragItem;
  }

  drop(item: UserExamDragAndDrop) {
    if (this.draggedItem) {
      if (item.answer) {
        this.removeDrop(item);
      }
      const existingDropItem = this.dropItems?.find(
        (drop) => drop.answer === this.draggedItem?.randomDropItem
      );
      if (existingDropItem) {
        existingDropItem.answer = '';
      }

      item.answer = this.draggedItem.randomDropItem;
      item.answerAr = this.draggedItem.randomDropItemAr;
      this.draggedItem = null;

      console.log(this.dragItems);
      console.log(this.dropItems);

      this.dragItems = this.dragItems?.filter(
        (i) => i.randomDropItem !== item.answer
      );

      console.log(this.dragItems);
    }
  }

  dragEnd() {
    this.draggedItem = null;
  }

  removeDrop(item: UserExamDragAndDrop) {
    const dragItem = this.dragAndDrop.find(
      (i) => i.randomDropItem === item.answer
    );
    if (dragItem) {
      item.answer = '';
      this.dragItems = [...this.dragItems, dragItem];
    }
  }

  getQuestionColor(questionId: number): string {
    const colors = ['#ff9999', '#99ccff', '#99ff99', '#ffcc99'];
    return colors[(questionId - 1) % colors.length];
  }

  startTimer(timeInSeconds: number): void {
    this.remainingTime = timeInSeconds;
    this.intervalId = setInterval(() => {
      this.remainingTime!--;
    }, 1000);
  }

  // formatTime(seconds: number): string {
  //   const minutes = Math.floor(Math.abs(seconds) / 60);
  //   const remainingSeconds = Math.abs(seconds) % 60;
  //   const sign = seconds < 0 ? '- ' : '';
  //   return `${+sign}${this.padZero(+minutes)}:${this.padZero(+remainingSeconds)}`;
  // }

  padZero(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }

  updateProgress(increment: number): void {
    this.progress = Math.min(100, this.progress! + increment);
  }

  getProgressBarColor(): string {
    const progressFloor = Math.floor(this.progress);
    if (progressFloor <= 33) {
      return 'red';
    } else if (progressFloor <= 66) {
      return 'yellow';
    } else {
      return 'green';
    }
  }

  getLetterByIndex(index: number): string {
    return this.language === 'ar'
      ? this.arabicLetters![index]
      : this.letters![index];
  }

  ngOnDestroy(): void {
    this.pauseTimer();
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
