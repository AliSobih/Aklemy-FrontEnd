// slider-table.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderService } from '@services/slider.service';
import { Slider } from '@common/slider';
import { Constants } from '@common/constants';
import Swal from 'sweetalert2';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-slider-table',
  templateUrl: './slider-table.component.html',
  styleUrls: ['./slider-table.component.scss'],
  standalone: true,
  imports: [CommonModule, SkeletonModule],
})
export class SliderTableComponent implements OnInit {
  sliders: Slider[] = [];
  dounloadImageApi = Constants.SLIDER_DOWNLOAD_IMAGE_AOI;
  deleteImageApi = Constants.SLIDER_DELETE_IMAGE_API;
  loaddata: boolean = false;
  loadError: boolean = false;

  constructor(private sliderService: SliderService) {}

  ngOnInit() {
    this.loadSliders();
    this.sliderService.updateSliderList.subscribe(() => this.loadSliders());
  }

  loadSliders() {
    this.loaddata = false;
    this.sliderService.getAllAds().subscribe({
      next: (data) => {
        this.loaddata = true;
        this.sliders = data;
      },
      error: (error) => {
        this.loaddata = false;
        this.loadError = true;
      },
    });
  }

  deleteSlider(id: number) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success ml-2',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.sliderService.deleteAd(id).subscribe((response) => {
            swalWithBootstrapButtons.fire({
              title: 'Deleted!',
              text: 'Your file has been deleted.',
              icon: 'success',
            });
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: 'Cancelled',
            text: 'Your imaginary file is safe ',
            icon: 'error',
          });
        }
      });
  }
}
