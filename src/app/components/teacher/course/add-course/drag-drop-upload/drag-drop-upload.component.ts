import { Component, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-drag-drop-upload',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './drag-drop-upload.component.html',
  styleUrls: ['./drag-drop-upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DragDropUploadComponent),
      multi: true,
    },
  ],
})
export class DragDropUploadComponent implements ControlValueAccessor {
  isDragging = false;
  photoControl = new FormControl<File | null>(null);
  photoPreview: string | ArrayBuffer | null = null;

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
    this.photoControl.setValue(file);

    const reader = new FileReader();
    reader.onload = () => {
      this.photoPreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  writeValue(value: File | null): void {
    if (value) {
      this.photoControl.setValue(value);
    }
  }

  registerOnChange(fn: any): void {
    this.photoControl.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    // Register touch event
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.photoControl.disable();
    } else {
      this.photoControl.enable();
    }
  }
}
