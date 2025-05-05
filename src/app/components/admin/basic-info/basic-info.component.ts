import { BasicInfoService } from '@services/basic-info.service';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BasicInfo } from '@common/basic-info';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-basic-info',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './basic-info.component.html',
  styleUrl: './basic-info.component.scss',
})
export class BasicInfoComponent implements OnInit {
  basicInfoForm: FormGroup;
  basicInfoData?: BasicInfo;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private basicInfoService: BasicInfoService
  ) {
    this.basicInfoForm = this.fb.group({
      id: [0],
      facebook: ['', [Validators.required, Validators.pattern('https?://.+')]],
      instagram: ['', [Validators.required, Validators.pattern('https?://.+')]],
      twitter: ['', [Validators.required, Validators.pattern('https?://.+')]],
      tiktok: ['', [Validators.required, Validators.pattern('https?://.+')]],
      youtube: ['', [Validators.required, Validators.pattern('https?://.+')]],
      telegram: ['', [Validators.required, Validators.pattern('https?://.+')]],
      messenger: ['', [Validators.required, Validators.pattern('https?://.+')]],
      whatsapp: [
        '',
        [Validators.required, Validators.pattern('https://wa.me/[0-9]{11}')],
      ],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{10,15}')]],
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.basicInfoService.gitbasicInfo().subscribe({
      next: (response) => {
        if (response !== null && response.length > 0) {
          this.basicInfoData = response[0];
        }
        if (response.length > 0) {
          this.isEditMode = true;
          this.basicInfoForm.patchValue({
            id: this.basicInfoData?.id,
            facebook: this.basicInfoData?.facebook,
            instagram: this.basicInfoData?.instagram,
            twitter: this.basicInfoData?.twitter,
            tiktok: this.basicInfoData?.tiktok,
            youtube: this.basicInfoData?.youtube,
            telegram: this.basicInfoData?.telegram,
            messenger: this.basicInfoData?.messenger,
            whatsapp: this.basicInfoData?.whatsApp,
            phone: this.basicInfoData?.phone,
          });
        }
      },
      error: (error) => {
        this.isEditMode = false;
      },
    });
  }

  onSubmit(): void {
    if (!this.basicInfoForm.valid) {
      return;
    }

    const formValue = this.basicInfoForm.value;
    const data: BasicInfo = {
      id: formValue.id,
      facebook: formValue.facebook,
      instagram: formValue.instagram,
      twitter: formValue.twitter,
      tiktok: formValue.tiktok,
      youtube: formValue.youtube,
      telegram: formValue.telegram,
      messenger: formValue.messenger,
      whatsApp: formValue.whatsapp,
      phone: formValue.phone,
    };

    if (this.isEditMode) {
      this.basicInfoService.updateData(data).subscribe({
        next: (response) => {
          Swal.fire('Saved!', '', 'success');
          this.loadData();
        },
        error: (error) => {},
      });
    } else {
      this.basicInfoService.postBasicInfo(data).subscribe({
        next: (response) => {
          Swal.fire('Saved!', '', 'success');
        },
        error: (error) => {},
      });
    }
  }

  get formControls() {
    return this.basicInfoForm.controls;
  }
}
