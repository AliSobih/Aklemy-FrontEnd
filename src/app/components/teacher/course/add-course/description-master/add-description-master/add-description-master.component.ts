import { Component, Input, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormArray,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Details } from '@common/details';
import { DescriptionMaster } from '@common/description-master';
import { DescriptionMasterService } from '@services/description-master.service';

@Component({
  selector: 'app-add-description-master',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './add-description-master.component.html',
  styleUrls: ['./add-description-master.component.scss'],
})
export class AddDescriptionMasterComponent implements OnInit {
  myform: FormGroup;
  hasUnsavedChanges = false;
  @Input() courseId: any;
  @Input() descriptionMasterItem?: DescriptionMaster;
  isEditMode = false;
  private categoriesSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private descriptionMasterService: DescriptionMasterService
  ) {
    this.myform = this.fb.group({
      title: [''],
      titleAr: [''],
      description: this.fb.array([]),
    });
  }

  ngOnInit() {
    if (this.isEditMode && this.descriptionMasterItem) {
      this.loadData(this.descriptionMasterItem);
    }
  }

  get description(): FormArray {
    return this.myform.get('description') as FormArray;
  }

  addDescription(): void {
    const descriptionGroup: FormGroup = this.fb.group({
      note: [''],
      noteAr: [''],
    });
    this.description.push(descriptionGroup);
    this.hasUnsavedChanges = true;
  }

  removeDescription(index: number): void {
    this.description.removeAt(index);
    this.hasUnsavedChanges = true;
  }

  loadData(data: DescriptionMaster): void {
    this.myform.patchValue({
      title: data.note,
      titleAr: data.noteAr,
    });
    this.description.clear();
    if (Array.isArray(data.details)) {
      data.details.forEach((desc: any) => {
        this.addDescription();
        this.description.at(this.description.length - 1).patchValue({
          note: desc.note,
          noteAr: desc.noteAr,
        });
      });
    }
  }

  onSubmit(): void {
    if (this.myform.valid) {
      let data = this.myform.value;
      data['courseId'] = this.courseId;

      let req = {
        courseId: this.courseId,
        note: data.title,
        noteAr: data.titleAr,
        details: data.description.map((desc: Details, index: number) => {
          return {
            note: desc.note,
            noteAr: desc.noteAr,
            id:
              this.isEditMode && this.descriptionMasterItem?.details[index]?.id
                ? this.descriptionMasterItem.details[index].id
                : undefined,
          };
        }),
        id: this.descriptionMasterItem?.id
          ? this.descriptionMasterItem.id
          : undefined,
      };

      if (this.isEditMode) {
        this.descriptionMasterService.updateData(req).subscribe({
          next: () => {
            Swal.fire({
              title: 'Updated!',
              text: 'The description master has been updated. Do you want to exit?',
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
          error: () => {
            Swal.fire(
              'Error!',
              'There was an error updating the description master.',
              'error'
            );
          },
        });
      } else {
        this.descriptionMasterService.postData(req).subscribe({
          next: () => {
            Swal.fire(
              'Success!',
              'The description master has been created.',
              'success'
            );
            this.hasUnsavedChanges = false;
            this.myform.reset();
            this.activeModal.close();
          },
          error: () => {
            Swal.fire(
              'Error!',
              'There was an error creating the description master.',
              'error'
            );
          },
        });
      }
    }
  }
}
