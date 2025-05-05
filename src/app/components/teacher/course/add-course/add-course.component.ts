import { User } from '@common/user';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Category } from '../../../../common/category';
import { CourseService } from '../../../../services/course.service';
import { CategoryService } from '../../../../services/category.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Course } from '../../../../common/course';
import { Section } from '../../../../common/section';
import { Lesson } from '../../../../common/lesson';
import Swal from 'sweetalert2';
import {
  CanComponentDeactivate,
  CanDeactivateType,
} from '../../../../services/unsaved-changes.guard';
import { Subject } from 'rxjs';
import { DragDropUploadComponent } from './drag-drop-upload/drag-drop-upload.component';
import { AddVideoComponent } from './add-video/add-video.component';
import { Constants } from '@common/constants';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-add-course',
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
    SkeletonModule,
  ],
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss'],
})
export class AddCourseComponent implements OnInit, CanComponentDeactivate {
  courseForm: FormGroup;
  categoryList: Category[] = [];
  hasUnsavedChanges = false;
  isDataSaved = false;
  photoPreviewUrl: string | ArrayBuffer | null = null;
  imageUrl: string = '';
  isEditMode: boolean = false;
  currentCourseId?: number;
  descriptionMaster?: any;
  expandedSectionIndex: number | null = null;
  expandedLessonIndexes: { [sectionIndex: number]: number | null } = {};
  currentLessonId: number | null = null;

  imagePreview: string | ArrayBuffer | null = null;
  isDragging = false;
  selectedFile: File | null = null;
  oldImageName: string = '';
  maxFileSize = 1024 * 1024; // 1MB

  courseLoaded: boolean = false;
  courseError: boolean = false;
  private User: User = new User();

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private categoryService: CategoryService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.courseForm = this.fb.group({
      id: [0],
      photo: [null],
      titleArabic: ['', Validators.required],
      titleEnglish: ['', Validators.required],
      descriptionArabic: ['', Validators.required],
      descriptionEnglish: ['', Validators.required],
      language: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      fixedPrice: [0, [Validators.required, Validators.min(0)]],
      categoryId: ['', Validators.required],
      sections: this.fb.array([]),
    });

    this.courseForm.valueChanges.subscribe(() => {
      if (this.isEditMode) {
        this.hasUnsavedChanges = true;
      }
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    const courseId = this.activatedRoute.snapshot.paramMap.get('id');
    if (courseId) {
      this.isEditMode = true;
      this.currentCourseId = +courseId;
      this.loadCourseData(this.currentCourseId);
    }
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
      if (file.size > this.maxFileSize) {
        // 1MB limit
        Swal.fire('Error', 'File size must be less than 1MB', 'error');
        return;
      }

      this.handleFile(file);
    }
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      if (file.size > this.maxFileSize) {
        // 1MB limit
        Swal.fire('Error', 'File size must be less than 1MB', 'error');
        return;
      }
      this.handleFile(file);
    }
  }

  handleFile(file: File) {
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    this.courseForm.patchValue({
      photo: this.selectedFile?.name,
    });
    reader.readAsDataURL(file);
    if (this.isEditMode) {
      this.hasUnsavedChanges = true;
    }
  }

  removeImage() {
    this.courseForm.patchValue({
      photo: '',
    });
    this.imagePreview = null;
    this.imageUrl = '';
    if (this.isEditMode) {
      this.hasUnsavedChanges = true;
    }
  }

  loadCategories(): void {
    this.categoryService.getallData().subscribe(
      (categories: Category[]) => (this.categoryList = categories),
      (error) => this.handleError(error, 'Error loading categories')
    );
  }

  loadCourseData(courseId: number): void {
    this.courseLoaded = false;
    this.courseError = false;
    this.courseService.getCourseById(courseId).subscribe(
      (course: Course) => {
        this.courseLoaded = true;
        this.patchCourseData(course);
      },
      (error) => {
        this.handleError(error, 'Error loading course data');
        this.courseError = true;
      }
    );
  }

  patchCourseData(course: Course): void {
    this.imagePreview = Constants.COURSE_DOWNLOAD_IMAGE_API + course.imageURL!;
    this.oldImageName = course.imageURL!;

    this.imageUrl = course.imageURL;
    this.courseForm.patchValue({
      id: course.id,
      photo: course.imageURL,
      titleArabic: course.titleAr,
      titleEnglish: course.title,
      descriptionArabic: course.descriptionAr,
      descriptionEnglish: course.description,
      language: course.language,
      price: course.price,
      fixedPrice: course.fixedPrice,
      categoryId: course.categoryId,
    });
    this.sections.clear();
    course.sections.forEach((section) => {
      const sectionGroup = this.fb.group({
        id: [section.id],
        courseId: [section.courseID],
        arabicTitle: [section.titleAr, Validators.required],
        englishTitle: [section.title, Validators.required],
        position: [section.position, [Validators.required, Validators.min(1)]],
        lessons: this.fb.array([]),
      });
      this.sections.push(sectionGroup);

      section.lessons.forEach((lesson) => {
        const lessonGroup = this.fb.group({
          id: [lesson.id],
          sectionId: [section.id],
          titleArabic: [lesson.titleAr, Validators.required],
          titleEnglish: [lesson.title, Validators.required],
          duration: [lesson.duration],
          position: [lesson.position, [Validators.required, Validators.min(1)]],
          courseType: [lesson.isVisible ? 'free' : 'paid', Validators.required],
          contentURL: [lesson.contentURL],

          contentType: [lesson.contentType],
          contentTypeAr: [lesson.contentTypeAr],
        });
        (sectionGroup.get('lessons') as FormArray).push(lessonGroup);
      });
    });
  }

  handleError(error: any, message: string): void {
    console.error(error);
    Swal.fire('Error', message, 'error');
  }

  canDeactivate(): CanDeactivateType {
    if (this.isEditMode && this.hasUnsavedChanges) {
      const deactivateSubject = new Subject<boolean>();

      Swal.fire({
        title: 'Are you sure?',
        text: 'You have unsaved changes. Do you really want to leave?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, leave',
        cancelButtonText: 'No, stay',
      }).then((result) => {
        deactivateSubject.next(result.isConfirmed);
      });
      return deactivateSubject.asObservable();
    } else {
      return true;
    }
  }

  get sections(): FormArray {
    return this.courseForm.get('sections') as FormArray;
  }

  addSection() {
    const sectionGroup = this.fb.group({
      id: [0],
      courseId: [0],
      arabicTitle: ['', Validators.required],
      englishTitle: ['', Validators.required],
      position: [1, [Validators.required, Validators.min(1)]],
      lessons: this.fb.array([]),
    });
    this.sections.push(sectionGroup);
    this.updateSectionPositions();
    if (this.isEditMode) {
      this.hasUnsavedChanges = true;
    }
  }

  removeSection(index: number, sectionId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to remove this section?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        this.sections.removeAt(index);
        Swal.fire('Removed!', 'The section has been removed.', 'success');
        this.updateSectionPositions();

        if (this.isEditMode && sectionId) {
          this.courseService.deleteSections(sectionId).subscribe({
            next: () => {
              Swal.fire(
                'Removed!',
                'The section has been removed from the server.',
                'success'
              );
            },
            error: (error) => {
              Swal.fire(
                'Error',
                'Error removing section from the server',
                'error'
              );
            },
          });
        } else {
          this.hasUnsavedChanges = true;
        }
      }
    });
  }

  addLesson(sectionIndex: number) {
    const lessonGroup = this.fb.group({
      id: [0],
      sectionId: [0],
      titleArabic: ['', Validators.required],
      titleEnglish: ['', Validators.required],
      duration: [0, Validators.required],
      position: [1, [Validators.required]],
      courseType: ['paid', Validators.required],
      contentURL: [''],
    });
    this.getLessons(sectionIndex).push(lessonGroup);
    this.updateLessonPositions(sectionIndex);
    if (this.isEditMode) {
      this.hasUnsavedChanges = true;
    }
  }

  removeLesson(sectionIndex: number, lessonIndex: number, id: number) {
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
        this.getLessons(sectionIndex).removeAt(lessonIndex);
        Swal.fire('Deleted!', 'Your lesson has been deleted.', 'success');
        this.updateLessonPositions(sectionIndex);

        if (this.isEditMode) {
          this.courseService.deleteLesson(id).subscribe({
            next: () => {
              Swal.fire(
                'Deleted!',
                'Your lesson has been deleted from the server.',
                'success'
              );
            },
            error: (error) => {
              Swal.fire(
                'Error',
                'Error deleting lesson from the server',
                'error'
              );
            },
          });
        } else {
          // Optionally add any logic needed for new course creation mode
          this.hasUnsavedChanges = true;
        }
      }
    });
  }

  getLessons(sectionIndex: number): FormArray {
    return this.sections.at(sectionIndex).get('lessons') as FormArray;
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        this.photoPreviewUrl = reader.result;
      };
      reader.readAsDataURL(input.files[0]);
      if (this.isEditMode) {
        this.hasUnsavedChanges = true;
      }
    }
  }

  confirmAction(message: string, action: () => void): void {
    Swal.fire({
      title: 'Are you sure?',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, proceed',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        action();
      }
    });
  }

  handleSuccess(message: string, navigateTo: string): void {
    this.courseForm.reset();
    this.hasUnsavedChanges = false;
    Swal.fire('Success', message, 'success');
    if (this.router.url.includes('admin')) {
      this.router.navigate(['admin/courses']);
    } else {
      this.router.navigate(['teacher']);
    }
  }

  onSubmit() {
    if (this.courseForm.valid && this.courseForm.value.photo) {
      this.hasUnsavedChanges = false;

      const formData = this.courseForm.value;
      this.imageUrl = formData.photo;
      const sections: Section[] = formData.sections.map((sectionsData: any) => {
        const lessons: Lesson[] = sectionsData.lessons.map(
          (lessonData: any) => {
            return new Lesson(
              lessonData.titleEnglish,
              lessonData.contentType,
              lessonData.contentURL,
              lessonData.duration,
              lessonData.position,
              lessonData.courseType == 'free',
              lessonData.titleArabic,
              lessonData.contentTypeArabic,
              sectionsData.id,
              lessonData.id
            );
          }
        );

        return new Section(
          sectionsData.englishTitle,
          sectionsData.position,
          sectionsData.arabicTitle,
          lessons,
          sectionsData.courseID,
          sectionsData.id
        );
      });
      if (this.isEditMode) {
        let course: Course | undefined;
        if (this.oldImageName !== formData.photo) {
          this.courseService.uploadPhoto(this.selectedFile!).subscribe(() => {
            course = new Course(
              formData.titleEnglish,
              formData.descriptionEnglish,
              formData.language,
              formData.price,
              formData.fixedPrice,
              formData.categoryId,
              this.User.id,
              formData.titleArabic,
              formData.descriptionArabic,
              this.imageUrl,
              sections,
              this.descriptionMaster,
              this.currentCourseId
            );

            this.updateCourse(course);
          });
        } else {
          course = new Course(
            formData.titleEnglish,
            formData.descriptionEnglish,
            formData.language,
            formData.price,
            formData.fixedPrice,
            formData.categoryId,
            this.User.id,
            formData.titleArabic,
            formData.descriptionArabic,
            this.imageUrl,
            sections,
            this.descriptionMaster,
            this.currentCourseId
          );
          this.updateCourse(course);
        }
      } else {
        this.courseService.uploadPhoto(this.selectedFile!).subscribe(() => {
          const course: Course = new Course(
            formData.titleEnglish,
            formData.descriptionEnglish,
            formData.language,
            formData.price,
            formData.fixedPrice,
            formData.categoryId,
            this.User.id,
            formData.titleArabic,
            formData.descriptionArabic,
            this.imageUrl,
            sections,
            this.descriptionMaster,
            this.currentCourseId
          );
          this.hasUnsavedChanges = false;
          this.addCourse(course);
        });
      }
    } else {
      this.courseForm.markAllAsTouched();
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      });
    }
  }

  updateCourse(course: Course): void {
    this.confirmAction('You are about to update the course details.', () => {
      this.courseService.updateCourse(course).subscribe(
        () => this.handleSuccess('Course has been updated.', '/teacher'),
        (error) => this.handleError(error, 'Error updating course')
      );
    });
  }

  addCourse(course: Course): void {
    this.courseService.addCourse(course).subscribe(
      () =>
        this.handleSuccess('Course has been added successfully', '/teacher'),
      (error) => this.handleError(error, 'Error adding course')
    );
  }

  updateSectionPositions() {
    this.sections.controls.forEach((sectionControl, index) => {
      sectionControl.get('position')?.setValue(index + 1);
    });
  }

  updateLessonPositions(sectionIndex: number) {
    const lessonsArray = this.getLessons(sectionIndex);
    lessonsArray.controls.forEach((lessonControl, index) => {
      lessonControl.get('position')?.setValue(index + 1);
    });
  }

  moveSectionUp(sectionIndex: number) {
    if (sectionIndex > 0) {
      const sectionsArray = this.sections;
      const section = sectionsArray.at(sectionIndex);
      sectionsArray.removeAt(sectionIndex);
      sectionsArray.insert(sectionIndex - 1, section);
      this.updateSectionPositions();
      this.expandedSectionIndex = sectionIndex - 1;
    }
  }

  moveSectionDown(sectionIndex: number) {
    const sectionsArray = this.sections;
    if (sectionIndex < sectionsArray.length - 1) {
      const section = sectionsArray.at(sectionIndex);
      sectionsArray.removeAt(sectionIndex);
      sectionsArray.insert(sectionIndex + 1, section);
      this.updateSectionPositions();
      this.expandedSectionIndex = sectionIndex + 1;
    }
  }

  moveLessonUp(sectionIndex: number, lessonIndex: number) {
    const lessonsArray = this.getLessons(sectionIndex);
    if (lessonIndex > 0) {
      const lesson = lessonsArray.at(lessonIndex);
      lessonsArray.removeAt(lessonIndex);
      lessonsArray.insert(lessonIndex - 1, lesson);
      this.updateLessonPositions(sectionIndex);
      this.expandedSectionIndex = sectionIndex;
      this.expandedLessonIndexes[sectionIndex] = lessonIndex - 1;
    }
  }

  moveLessonDown(sectionIndex: number, lessonIndex: number) {
    const lessonsArray = this.getLessons(sectionIndex);
    if (lessonIndex < lessonsArray.length - 1) {
      const lesson = lessonsArray.at(lessonIndex);
      lessonsArray.removeAt(lessonIndex);
      lessonsArray.insert(lessonIndex + 1, lesson);
      this.updateLessonPositions(sectionIndex);
      this.expandedSectionIndex = sectionIndex;
      this.expandedLessonIndexes[sectionIndex] = lessonIndex + 1;
    }
  }
}
