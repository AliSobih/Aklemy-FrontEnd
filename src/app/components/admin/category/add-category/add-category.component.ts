import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Category } from '../../../../common/category';
import { CategoryService } from '../../../../services/category.service';
import Swal from 'sweetalert2';
import { Constants } from '@common/constants';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss'],
})
export class AddCategoryComponent implements OnInit {
  @Input() categoryToEdit?: Category;
  myform: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  isDragging = false;
  selectedFile: File | null = null;
  oldImageName: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    public activeModal: NgbActiveModal
  ) {
    this.myform = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      nameAr: ['', Validators.required],
      descriptionAr: ['', Validators.required],
      imageUrl: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.categoryToEdit) {
      this.myform.patchValue(this.categoryToEdit);
      this.imagePreview =
        Constants.CATEGORY_DOWNLOAD_IMAGE + this.categoryToEdit.imageUrl!;
      this.oldImageName = this.categoryToEdit.imageUrl!;
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
    this.myform.patchValue({
      imageUrl: this.selectedFile?.name,
    });
    reader.readAsDataURL(file);
  }

  removeImage() {
    this.myform.patchValue({
      imageUrl: '',
    });
    this.imagePreview = null;
  }

  onSubmit() {
    if (this.myform.invalid) {
      Swal.fire('Error!', 'Please fill all the required fields.', 'error');
      return;
    }

    if (this.selectedFile && this.oldImageName !== this.myform.value.imageUrl) {
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);

      this.categoryService.uploadImages([this.selectedFile]).subscribe({
        next: (response) => {
          this.submitFormData();
        },
        error: (error) => {
          Swal.fire(
            'Error!',
            'There was an error uploading the image.',
            'error'
          );
        },
      });
    } else {
      this.submitFormData();
    }
  }

  submitFormData() {
    let data = this.myform.value;

    if (this.categoryToEdit) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to update this category?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.categoryService
            .updateData({ ...this.categoryToEdit, ...data })
            .subscribe({
              next: (data) => {
                this.myform.reset();
                this.activeModal.close('Close click');
                Swal.fire(
                  'Updated!',
                  'The category has been updated.',
                  'success'
                );
              },
              error: (error) => {
                Swal.fire(
                  'Error!',
                  'There was an error updating the category.',
                  'error'
                );
              },
            });
        }
      });
    } else {
      this.categoryService.postData(data).subscribe({
        next: (data) => {
          this.myform.reset();
          this.activeModal.close('Close click');
          Swal.fire('Saved!', 'The category has been saved.', 'success');
        },
        error: (error) => {
          Swal.fire(
            'Error!',
            'There was an error saving the category.',
            'error'
          );
        },
      });
    }
  }

  onclose() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to close without saving?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, close it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.activeModal.close('Close click');
      }
    });
  }

  hasUnsavedChanges = false;

  onInputChange() {
    this.hasUnsavedChanges = true;
  }

  canDeactivate(): Promise<boolean> {
    if (this.hasUnsavedChanges) {
      return Swal.fire({
        title: 'Are you sure?',
        text: 'You have unsaved changes. Do you really want to leave?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, leave',
        cancelButtonText: 'No, stay',
      }).then((result) => result.isConfirmed);
    } else {
      return Promise.resolve(true);
    }
  }

  openAddCourseModal() {
    // Your logic to open the modal
  }
}
