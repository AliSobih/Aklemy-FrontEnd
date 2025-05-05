import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoUploadService } from '@services/video-upload.service';
import { catchError, of, switchMap } from 'rxjs';
import Swal from 'sweetalert2';
import { ProgressBarModule } from 'primeng/progressbar';
// For dynamic progressbar demo
import { ToastModule } from 'primeng/toast';
import { SecondsToTimePipe } from '../../../../../common/pipe/secods-to-time.pipe';

@Component({
  selector: 'app-add-video',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ProgressBarModule,
    SecondsToTimePipe,
  ],
  templateUrl: './add-video.component.html',
  styleUrls: ['./add-video.component.scss'],
})
export class AddVideoComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement> | undefined;
  lessonId: number | null = null;
  courseId: number | null = null;
  isDragging = false;
  fileControl = new FormControl<File | null>(null);
  filePreview: string | null = null;
  fileType: string | null = null;
  videoDuration: number | null = null;
  isUploaded: boolean | null = null;
  isLoading: boolean = false;
  uploadProgress: number = 0;
  maxVideoSize = 1024 * 1024 * 200;
  maxPdfFileSize = 1024 * 1024 * 10;

  constructor(
    private videoUploadService: VideoUploadService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private activateRouter: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params['courseId']) {
        this.courseId = +params['courseId'];
      }
      if (params['lessonId']) {
        this.lessonId = +params['lessonId'];
      }
    });
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.processFile(file);
    }
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      this.processFile(file);
    }
  }

  processFile(file: File): void {
    if (
      file.size >
      (file.type == 'application/pdf' ? this.maxPdfFileSize : this.maxVideoSize)
    ) {
      Swal.fire(
        'Error',
        'File size must be less than ' +
          (file.type == 'application/pdf'
            ? this.maxPdfFileSize / 1024 / 1024
            : this.maxVideoSize / 1024 / 1024) +
          'MB',
        'error'
      );
      return;
    }
    this.fileControl.setValue(file);
    this.fileType = file.type;
    this.filePreview = URL.createObjectURL(file);
    this.calculateVideoDuration(file);
  }

  calculateVideoDuration(file: File): void {
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      this.videoDuration = Math.round(video.duration);
    };

    video.src = URL.createObjectURL(file);
  }

  renameFileWithExtension(file: File, newName: string): File {
    const originalName = file.name;
    const lastDotIndex = originalName.lastIndexOf('.');
    const extension =
      lastDotIndex !== -1 ? originalName.slice(lastDotIndex) : '';
    const newFileName = newName + extension;

    return new File([file], newFileName, { type: file.type });
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    if (this.fileControl.value && this.lessonId !== null) {
      const file = this.renameFileWithExtension(
        this.fileControl.value,
        this.lessonId.toString()
      );

      console.log(this.videoDuration);
      console.log(file.name);
      const req = {
        contentType: this.fileType,
        contentURL: file.name,
        duration: this.videoDuration,
      };
      const formData = new FormData();
      formData.append('file', file);

      this.isUploaded = true;
      this.isLoading = true;

      this.videoUploadService
        .postData(formData)
        .pipe(
          switchMap((postDataResponse) => {
            return this.videoUploadService.updateData(req, this.lessonId);
          }),
          catchError((error) => {
            this.isUploaded = false;
            return of(null);
          })
        )
        .subscribe({
          next: (updateDataResponse) => {
            this.isLoading = false;
            if (this.isUploaded === false) {
              this.errorAlert();
            } else {
              this.successalert();
              if (this.router.url.includes('admin')) {
                this.router.navigate(['../'], {
                  relativeTo: this.activateRouter,
                });
              } else {
                this.router.navigate(['teacher', 'view-course', this.courseId]);
              }
            }
          },
          error: (error) => {
            this.errorAlert();
            this.isUploaded = false;
            this.isLoading = false;
          },
        });
    }
  }

  errorAlert() {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Something went wrong!',
    });
  }

  successalert() {
    Swal.fire({
      title: 'Good job!',
      text: 'The Video uploaded Successfully!',
      icon: 'success',
    });
  }
}
