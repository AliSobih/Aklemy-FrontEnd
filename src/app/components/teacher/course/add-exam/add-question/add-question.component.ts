import { Question } from '@common/question';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { QuestionService } from '@services/question.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { AddVideoComponent } from '../../add-course/add-video/add-video.component';
import { DragDropUploadComponent } from '../../add-course/drag-drop-upload/drag-drop-upload.component';
import { Constants } from '@common/constants';
import { switchMap } from 'rxjs';
import { DragAndDrop } from '@common/drag-and-drop';
import { Answer } from '@common/answer';

@Component({
  selector: 'app-add-question',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    DragDropUploadComponent,
    AddVideoComponent,
  ],
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss'],
})
export class AddQuestionComponent implements OnInit {
  questionData: Question | undefined;
  courseId?: number;
  questionId?: number;
  isEditMode = false;

  questionForm: FormGroup;
  hasUnsavedChanges = false;
  imagePreview: string | ArrayBuffer | null = null;
  imageUrl: string = '';

  isDragging = false;
  selectedFile: File | null = null;
  oldImageName: string = '';

  constructor(
    private fb: FormBuilder,
    private questionService: QuestionService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.questionForm = this.fb.group({
      subject: ['', [Validators.required]],
      chapter: ['', [Validators.required]],
      level: ['easy'],
      status: ['SINGLE'],
      imagePath: [null],

      question: [''],
      questionAr: [''],
      answers: this.fb.array([]),
      dragAndDrops: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.courseId = +params['id'];
      this.questionId = +params['idupdet'];

      if (this.questionId) {
        this.isEditMode = true;
        this.loadQuestionData();
      } else {
        this.initializeDefaultAnswersOrDragAndDrops();
      }
    });
  }

  initializeDefaultAnswersOrDragAndDrops(): void {
    const type = this.questionForm.get('status')?.value;
    if (type === 'SINGLE' || type === 'MULTIPLE') {
      for (let i = 0; i < 4; i++) {
        this.addAnswer();
      }
    } else if (type === 'DRAG_DROP') {
      for (let i = 0; i < 4; i++) {
        this.addDragAndDrop();
      }
    }
  }

  loadQuestionData(): void {
    this.questionService.getQuestionById(this.questionId!).subscribe({
      next: (data) => {
        this.questionData = data;
        this.patchQuestionData(data);
      },
      error: (error) => {
        console.error('error', error);
      },
    });
  }
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    if (event.dataTransfer?.files.length) {
      const file = event.dataTransfer.files[0];
      this.handleFile(file);
    }
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      this.handleFile(file);
    }
  }

  handleFile(file: File) {
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    this.questionForm.patchValue({
      imagePath: this.selectedFile?.name,
    });
    reader.readAsDataURL(file);
  }
  removeImage() {
    this.questionForm.patchValue({
      imagePath: '',
    });
    this.imagePreview = null;
    this.imageUrl = '';
  }

  patchQuestionData(data: Question): void {
    this.imagePreview = Constants.QUESTION_DOWNLOAD_IMAGE_API + data.imagePath!;
    this.oldImageName = data.imagePath!;

    this.imageUrl = data.imagePath;
    this.questionForm.patchValue({
      imagePath: data.imagePath,
      subject: data.subject,
      chapter: data.chapter,
      level: data.level,
      status: data.status,
      question: data.question,
      questionAr: data.questionAr,
    });
    this.setAnswers(data.answers || []);
    this.setDragAndDrops(data.dragAndDrops || []);
  }

  setAnswers(answers: any[]): void {
    const answerFGs = answers.map((answer) => this.fb.group(answer));
    const answerFormArray = this.fb.array(answerFGs);
    this.questionForm.setControl('answers', answerFormArray);
  }

  setDragAndDrops(dragAndDrops: any[]): void {
    const dragAndDropFGs = dragAndDrops.map((dragAndDrop) =>
      this.fb.group(dragAndDrop)
    );
    const dragAndDropFormArray = this.fb.array(dragAndDropFGs);
    this.questionForm.setControl('dragAndDrops', dragAndDropFormArray);
  }

  get answers(): FormArray {
    return this.questionForm.get('answers') as FormArray;
  }

  get dragAndDrops(): FormArray {
    return this.questionForm.get('dragAndDrops') as FormArray;
  }
  hasCorrectAnswer(): boolean {
    return this.answers.controls.some(
      (control) => control.get('isCorrect')?.value
    );
  }

  addAnswer(): void {
    const answerGroup = this.fb.group({
      answer: [''],
      answerAr: [''],
      isCorrect: [false],
      description: [''],
      descriptionAr: [''],
    });
    this.answers.push(answerGroup);
  }

  addDragAndDrop(): void {
    const dragAndDropGroup = this.fb.group({
      dragItem: [''],
      dropItem: [''],
      dragItemAr: [''],
      dropItemAr: [''],
      randomDropItem: [''],
      randomDropItemAr: [''],
    });
    this.dragAndDrops.push(dragAndDropGroup);
  }

  ////////////////

  // handleCorrectAnswerSelection(selectedIndex: number): void {
  //   if (this.isMultipleChoice()) {
  //     this.syncCorrectAnswer(selectedIndex);
  //   } else {
  //     this.answers.controls.forEach((control, index) => {
  //       const isSelected = index === selectedIndex;
  //       control.get('isCorrect')?.setValue(isSelected);
  //     });
  //   }
  // }
  // syncCorrectAnswer(selectedIndex: number): void {
  //   if (this.questionForm.get('status')?.value === 'SINGLE') {
  //     this.answers.controls.forEach((control, index) => {
  //       if (index !== selectedIndex) {
  //         control.get('isCorrect')?.setValue(false);
  //       }
  //     });
  //   }
  // }
  // handleCorrectAnswerSelection(selectedIndex: number): void {
  //   if (this.isMultipleChoice()) {
  //     this.syncCorrectAnswer(selectedIndex);
  //   } else {
  //     this.answers.controls.forEach((control, index) => {
  //       const isSelected = index === selectedIndex;
  //       control.get('isCorrect')?.setValue(isSelected);
  //     });
  //   }
  // }
  // handleCorrectAnswerArSelection(selectedIndex: number): void {
  //   if (this.isMultipleChoice()) {
  //     this.syncCorrectAnswer(selectedIndex);
  //   } else {
  //     this.answers.controls.forEach((control, index) => {
  //       const isSelected = index === selectedIndex;
  //       control.get('isCorrect')?.setValue(isSelected);
  //     });
  //   }
  // }

  // syncCorrectAnswer(selectedIndex: number): void {
  //   if (this.questionForm.get('status')?.value === 'MULTIPLE') {
  //     this.answers.controls.forEach((control, index) => {
  //       if (index !== selectedIndex) {
  //         control.get('isCorrect')?.setValue(false);
  //       }
  //     });
  //   }
  // }
  syncCorrectAnswer(selectedIndex: number): void {
    if (this.questionForm.get('status')?.value === 'SINGLE') {
      this.answers.controls.forEach((control, index) => {
        if (index !== selectedIndex) {
          control.get('isCorrect')?.setValue(false);
        }
      });
    }
  }

  handleCorrectAnswerSelection(selectedIndex: number): void {
    // If it's a multiple choice question
    if (this.isMultipleChoice()) {
      this.syncCorrectAnswer(selectedIndex);
    } else {
      // For single choice questions
      this.answers.controls.forEach((control, index) => {
        control.get('isCorrect')?.setValue(index === selectedIndex);
      });
    }

    // Sync Arabic correct answer with English correct answer
    this.syncArabicCorrectAnswer(selectedIndex);
  }

  syncArabicCorrectAnswer(selectedIndex: number): void {
    const selectedAnswer = this.answers.at(selectedIndex);
    const isCorrect = selectedAnswer.get('isCorrect')?.value;

    // Update the Arabic 'isCorrect' based on the English 'isCorrect' value
    this.answers.controls.forEach((control, index) => {
      if (index === selectedIndex) {
        control.get('isCorrect')?.setValue(isCorrect);
      }
    });
  }

  // syncArabicCorrectAnswer(selectedIndex: number): void {
  //   const selectedAnswer = this.answers.at(selectedIndex);
  //   const isCorrect = selectedAnswer.get('isCorrect')?.value;

  //   // Update the Arabic 'isCorrect' based on the English 'isCorrect' value
  //   this.answers.controls.forEach((control, index) => {
  //     if (index === selectedIndex) {
  //       control.get('isCorrect')?.setValue(isCorrect);
  //     }
  //   });
  // }

  isChoiceType(): boolean {
    const type = this.questionForm.get('status')?.value;
    return type === 'SINGLE' || type === 'MULTIPLE';
  }

  isMultipleChoice(): boolean {
    return this.questionForm.get('status')?.value === 'MULTIPLE';
  }

  isDragDropType(): boolean {
    return this.questionForm.get('status')?.value === 'DRAG_DROP';
  }

  onTypeChange(): void {
    const type = this.questionForm.get('status')?.value;
    this.answers.clear();
    this.dragAndDrops.clear();

    if (type === 'SINGLE' || type === 'MULTIPLE') {
      for (let i = 0; i < 4; i++) {
        this.addAnswer();
      }
    } else if (type === 'DRAG_DROP') {
      for (let i = 0; i < 4; i++) {
        this.addDragAndDrop();
      }
    }
  }
  getEnglishLetter(index: number): string {
    return String.fromCharCode(65 + index); // Convert index to ASCII (A, B, C, ...)
  }

  getArabicLetter(index: number): string {
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

  resetForm(): void {
    this.questionForm.reset({
      imagePath: [null],
      subject: '',
      chapter: '',
      level: 'easy',
      status: 'SINGLE',
      question: '',
      questionAr: '',
      answers: this.fb.array([]),
      dragAndDrops: this.fb.array([]),
    });

    while (this.answers.length) {
      this.answers.removeAt(0);
    }
    while (this.dragAndDrops.length) {
      this.dragAndDrops.removeAt(0);
    }

    window.location.reload();
  }
  removeAnswer(index: number): void {
    if (this.answers.length <= 4) {
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.answers.removeAt(index);
        Swal.fire('Deleted!', 'Your answer has been deleted.', 'success');
      }
    });
  }
  removeDragAndDrop(index: number): void {
    if (this.dragAndDrops.length <= 4) {
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.dragAndDrops.removeAt(index);
        Swal.fire(
          'Deleted!',
          'Your drag-and-drop item has been deleted.',
          'success'
        );
      }
    });
  }

  submitQuestionForm(): void {
    if (this.questionForm.valid) {
      const formData = this.questionForm.value;
      formData.courseId = this.courseId;
      this.imageUrl = formData.imagePath;

      const type = this.questionForm.get('status')?.value;

      if (type === 'MULTIPLE' && this.answers.length < 4) {
        Swal.fire(
          'Error',
          'You must add at least 2 Multiple Choice answers',
          'error'
        );
        return;
      }
      if (type === 'SINGLE' && this.answers.length < 4) {
        Swal.fire('Error', 'You must add at least 2 Choice answers', 'error');
        return;
      }
      if (type === 'DRAG_DROP' && this.dragAndDrops.length < 4) {
        Swal.fire(
          'Error',
          'You must add at least 2 Drag and Drop items',
          'error'
        );
        return;
      }

      if (type === 'MULTIPLE' || type === 'SINGLE') {
        const hasCorrectAnswerr = formData.answers.some(
          (answer: any) => answer.isCorrect
        );

        if (!hasCorrectAnswerr) {
          Swal.fire(
            'Error',
            'You must mark at least one correct answer',
            'error'
          );
          return;
        }
      }

      if (this.questionId) {
        formData.id = this.questionId;
        if (this.oldImageName !== formData.imagePath) {
          this.questionService
            .uploadPhoto(this.selectedFile!)
            .pipe(switchMap(() => this.questionService.updateData(formData)))
            .subscribe({
              next: () => {
                this.showSuccessPopup(formData);
              },
              error: (error) => {
                console.error(error);
              },
            });
        } else {
          this.questionService.updateData(formData).subscribe({
            next: () => {
              this.showSuccessPopup(formData);
            },
            error: (error) => {
              console.error(error);
            },
          });
        }
      } else {
        if (this.imageUrl) {
          this.questionService
            .uploadPhoto(this.selectedFile!)
            .pipe(switchMap(() => this.questionService.postData(formData)))
            .subscribe({
              next: () => {
                this.showSuccessPopup(formData);
              },
              error: (error) => {
                console.error(error);
              },
            });
        } else {
          this.postFormData(formData);
        }
      }
    } else {
      this.questionForm.markAllAsTouched();
    }
  }

  postFormData(formData: Question) {
    this.questionService.postData(formData).subscribe({
      next: () => {
        this.showSuccessPopup(formData);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  showSuccessPopup(formData: Question): void {
    const questionHtml = this.buildQuestionHtml(formData);

    Swal.fire({
      title: 'Success',
      html: questionHtml,
      width: 900,
      icon: 'success',
      showCloseButton: true,
      confirmButtonColor: '#4caf50',
      willClose: () => {
        this.resetForm();
      },
    }).then(() => {
      window.location.reload();
    });
  }

  buildQuestionHtml(formData: any): string {
    const direction = formData.language === 'ar' ? 'rtl' : 'ltr';
    const align = formData.language === 'ar' ? 'right' : 'left';

  const answersHtml = formData.answers
    .map(
      (answer: Answer, index: number) => `
    <div class="question-box english-question" style="direction: ltr; text-align: left;">
      <div class="choices col-12">
        <div class="form-check">
          <div class="form-check-label d-flex justify-content-between align-items-center" for="englishChoiceA">
            <span>
              ${this.getEnglishLetter(index)}) ${answer.answer}
            </span>
            <span>${answer.isCorrect ? '✅' : '❌'}</span>
          </div>
        </div>
      </div>
    </div>
    ${
      index === 0
        ? `
        <div class="question-box english-question" style="direction: ltr; text-align: left;">
          <div class="choices col-12">
            <div class="explanation-title">Answer Description</div>
            <p>${answer.description}</p>
          </div>
        </div>
        `
        : ''
    }
  `
    )
    .join('');


   const answersArHtml = formData.answers
     .map(
       (answer: Answer, index: number) => `
    <div class="question-box arabic-question" style="direction: rtl; text-align: right;">
      <div class="choices col-12">
        <div class="form-check">
          <div class="form-check-label d-flex justify-content-between align-items-center" for="arabicChoiceA">
            <span>
              ${this.getArabicLetter(index)}) ${answer.answerAr}
            </span>
            <span>${answer.isCorrect ? '✅' : '❌'}</span>
          </div>
        </div>
      </div>
    </div>
    ${
      index === 0
        ? `
        <div class="question-box arabic-question" style="direction: rtl; text-align: right;">
          <div class="choices col-12">
            <div class="explanation-title">تفسير الاجابة</div>
            <p>${answer.descriptionAr}</p>
          </div>
        </div>
        `
        : ''
    }
  `
     )
     .join('');




      const dragAndDropsArHtml = formData.dragAndDrops
        .map(
          (dragAndDrop: DragAndDrop) => `
            <!-- Question Box -->



    <!-- Drag and Drop Area -->
    <div class="row justify-content-center mt-5 gap-sm"  style="direction: rtl; text-align: right;">
        <div class="col-12 col-md-6 mb-4">
            <div class="drag-item">
            ${dragAndDrop.dragItemAr}
            </div>
        </div>
        <div class="col-12 col-md-6 mb-4">
            <div class="drop-item">
            ${dragAndDrop.dropItemAr}
            </div>
        </div>
    </div>

    <!-- Description Box -->
    <div class="explanation-box"  style="direction: rtl; text-align: right;">
        <div class="explanation-title">إفلات  عشوائي </div>
        <p> ${dragAndDrop.randomDropItemAr}</p>
    </div>


        `
        )
        .join('');



       const dragAndDropsHtml = formData.dragAndDrops
         .map(
           (dragAndDrop: DragAndDrop) => `
          <!-- Question Box -->


    <!-- Drag and Drop Area -->
    <div class="row justify-content-center mt-5 gap-sm"  style="direction: ltr; text-align: left;">
        <div class="col-12 col-md-6 mb-4">
            <div class="drag-item">
            ${dragAndDrop.dragItem}
            </div>
        </div>
        <div class="col-12 col-md-6 mb-4">
            <div class="drop-item">
            ${dragAndDrop.dropItem}
            </div>
        </div>
    </div>

    <!-- Description Box -->
    <div class="explanation-box"  style="direction: ltr; text-align: left;">
        <div class="explanation-title">Random Drop Item</div>
        <p>${dragAndDrop.randomDropItem}</p>
    </div>


        `
         )
         .join('');

    // Conditional rendering for question and explanation
   const questionHtml = `
  <div class="container">
    ${
      formData.question
        ? `
      <div class="mb-3">
        ${formData.question}
      </div>
      ${
        formData.status === 'MULTIPLE' || formData.status === 'SINGLE'
          ? answersHtml
          : ''
      }
      ${formData.status === 'DRAG_DROP' ? dragAndDropsHtml : ''}

        `
        : ''
    }
    ${
      formData.questionAr
        ? `
        <div class="mb-3" style="direction: rtl; text-align: right;">${
          formData.questionAr
        }</div>
        ${
          formData.status === 'MULTIPLE' || formData.status === 'SINGLE'
            ? answersArHtml
            : ''
        }
        ${formData.status === 'DRAG_DROP' ? dragAndDropsArHtml : ''}
        `
        : ''
    }
  </div>
`;


    return `
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #ffffff;
          padding: 0;
          margin: 0;
        }
        .container {
          width: 100%;
          max-width: 1200px;

          direction: ${direction};
          text-align: ${align};
        }
        .question-box {
          background-color: #e6e6e6;
          border: 1px solid #cccccc;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 20px;
        }
        .choices {
          border: 1px solid #cccccc;
          padding: 10px;
          background-color: #f2f2f2;
          border-radius: 5px;
        }
        .explanation-box {
          background-color: #f2f2f2;
          border: 1px solid #cccccc;
          padding: 10px;
          border-radius: 5px;
          margin-top: 20px;
        }
        .explanation-title {
          font-weight: bold;
          font-size: 16px;
        }
        .explanation-box p {
          margin: 0;
          font-size: 14px;
        }
              .drag-item, .drop-item {
            min-height: 150px;
            max-height: 300px;
            min-width: 100px;
            max-width: 100%;
            border: 2px solid #cccccc;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 10px;
            word-wrap: break-word;
            overflow-wrap: break-word;
            overflow-y: auto;
            padding: 10px;
        }

        .drag-item {
            background-color: #e6e6e6;
        }

        .drop-item {
            background-color: #ddffdd;
        }

        .gap-sm {
            margin-bottom: 20px;
        }

        .question-box, .explanation-box {
            background-color: #e6e6e6;
            border: 1px solid #cccccc;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }

        .question, .explanation-title {
            font-weight: bold;
            font-size: 18px;
            margin-bottom: 10px;
        }

        .explanation-box p {
            margin: 0;
            font-size: 14px;
        }

        .text-center.mt-4 {
            margin-top: 40px;
        }

.form-check {
      padding-left: 0; }


      .swal2-actions {
      margin-top: 0px;}
      #swal2-title {
      margin-bottom: 0px;}

      </style>
      ${questionHtml}
    `;
  }
}
