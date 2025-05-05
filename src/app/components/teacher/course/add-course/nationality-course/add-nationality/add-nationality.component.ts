import { Component, Input } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

import { CommonModule } from '@angular/common';
import { Nationality } from '@common/nationality';
import { NationalityService } from '@services/nationality.service';

@Component({
  selector: 'app-add-nationality',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-nationality.component.html',
  styleUrl: './add-nationality.component.scss',
})
export class AddNationalityComponent {
  @Input() nationalityToEdit?: Nationality;
  @Input() courseId?: number = 0;
  myform: FormGroup;

  constructor(
    private formGroup: FormBuilder,
    private nationalityService: NationalityService,
    public activeModal: NgbActiveModal
  ) {
    this.myform = this.formGroup.group({
      name: ['', Validators.required],
      currency: ['', Validators.required],
      factor: [0, Validators.required],
      nameAr: ['', Validators.required],
      currencyAr: ['', Validators.required],
      rateExchange: [0, Validators.required],
      countryCode: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.nationalityToEdit) {
      this.myform.patchValue(this.nationalityToEdit);
    }
  }

  onSubmit() {
    if (this.myform.valid) {
      let data = this.myform.value;
      data['courseId'] = this.courseId;

      let req: Nationality = {
        courseId: data.courseId,
        name: data.name,
        currency: data.currency,
        factor: data.factor,
        nameAr: data.nameAr,
        currencyAr: data.currencyAr,
        countryCode: data.countryCode,
        rateExchange: data.rateExchange,
        id: this.nationalityToEdit?.id ? this.nationalityToEdit?.id : undefined,
      };

      if (this.nationalityToEdit) {
        this.nationalityService
          .updateData({
            ...this.nationalityToEdit,
            ...req,
          })
          .subscribe({
            next: (data) => {
              Swal.fire({
                title: 'Updated!',
                text: 'The Nationality has been updated. Do you want to exit?',
                icon: 'success',
                showCancelButton: true,
                confirmButtonText: 'Yes, exit',
                cancelButtonText: 'No, stay',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.hasUnsavedChanges = false;
                  this.myform.reset();
                  this.activeModal.close();
                }
              });
            },
            error: (error) => {
              console.error('Error updating data:', error);
              Swal.fire(
                'Error!',
                'There was an error updating the Nationality.',
                'error'
              );
            },
          });
      } else {
        this.nationalityService.postData(req).subscribe({
          next: () => {
            Swal.fire('Saved!', 'The Nationality has been saved.', 'success');
            this.myform.reset();
            this.activeModal.close('Close click');
          },
          error: (error) => {
            console.error('Error posting data:', error);
            Swal.fire(
              'Error!',
              'There was an error saving the Nationality.',
              'error'
            );
          },
        });
      }
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
