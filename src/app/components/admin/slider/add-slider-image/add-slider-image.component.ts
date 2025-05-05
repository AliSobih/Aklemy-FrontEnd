// add-slider-image.component.ts
import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { SliderService } from '@services/slider.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-slider-image',
  templateUrl: './add-slider-image.component.html',
  styleUrls: ['./add-slider-image.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class AddSliderImageComponent {
  imagePreview: string | ArrayBuffer | null = null;
  isDragging = false;
  selectedFile: File | null = null;

  constructor(
    private sliderService: SliderService,
    public activeModal: NgbActiveModal
  ) {}

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
    reader.readAsDataURL(file);
  }

  onSubmit() {
    if (this.selectedFile) {
      this.sliderService.uploadImages([this.selectedFile]).subscribe(() => {
        Swal.fire({
          title: 'Good job!',
          text: 'Image uploaded successfully!',
          icon: 'success',
        });

        this.activeModal.close();
      });
    }
  }

  onclose() {
    this.activeModal.dismiss();
  }
}
