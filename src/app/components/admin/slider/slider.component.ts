// slider.component.ts
import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { AddSliderImageComponent } from './add-slider-image/add-slider-image.component';
import { SliderTableComponent } from './slider-table/slider-table.component';
import { SidebarComponent } from '@core/sidebar/sidebar.component';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    SliderTableComponent,
    SidebarComponent,
    SkeletonModule,
    TableModule,],
})
export class SliderComponent {
  isSidebarHovered: boolean = false;

  constructor(private modalService: NgbModal) {}

  openAddSliderImageModal() {
    const modalRef = this.modalService.open(AddSliderImageComponent);
    modalRef.result.then(
      (result) => {
        // Handle the result if needed
      },
      (reason) => {
        // Handle the dismissal if needed
      }
    );
  }

  onSidebarHover() {
    this.isSidebarHovered = true;
  }

  onSidebarLeave() {
    this.isSidebarHovered = false;
  }
}
