import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Coupon } from '@common/coupon';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CouponService } from '@services/coupon.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-coupon',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-coupon.component.html',
  styleUrl: './add-coupon.component.scss',
})
export class AddCouponComponent {
  @Input() couponEdit?: Coupon;
  @Input() courseId?: number = 0;
  myform: FormGroup;

  constructor(
    private formGroup: FormBuilder,
    private couponService: CouponService,
    public activeModal: NgbActiveModal
  ) {
    this.myform = this.formGroup.group({
      code: ['', Validators.required],
      discountPercentage: [0, Validators.required],
      validFrom: ['', Validators.required],
      validTo: ['', Validators.required],
      isActive: [true],
    });
  }

  ngOnInit(): void {
    if (this.couponEdit) {
      this.myform.patchValue(this.couponEdit);
    }
  }

  onSubmit() {
    if (this.myform.valid) {
      let data = this.myform.value;
      data['courseId'] = this.courseId;

      let req: Coupon = {
        courseId: data.courseId,
        code: data.code,
        discountPercentage: data.discountPercentage,
        validFrom: data.validFrom,
        validTo: data.validTo,
        isActive: data.isActive,

        id: this.couponEdit?.id ? this.couponEdit?.id : undefined,
      };

      if (this.couponEdit) {
        this.couponService
          .updateData({
            ...this.couponEdit,
            ...req,
          })
          .subscribe({
            next: (data) => {
              Swal.fire({
                title: 'Updated!',
                text: 'The Coupon has been updated. Do you want to exit?',
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
                'There was an error updating the Coupon.',
                'error'
              );
            },
          });
      } else {
        this.couponService.postData(req).subscribe({
          next: () => {
            Swal.fire('Saved!', 'The Coupon has been saved.', 'success');
            this.myform.reset();
            this.activeModal.close('Close click');
          },
          error: (error) => {
            console.error('Error posting data:', error);
            Swal.fire(
              'Error!',
              'There was an error saving the Coupon.',
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
