import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Constants } from '@common/constants';
import { Slider } from '@common/slider';
import { SliderService } from '@services/slider.service';
import { GalleriaModule } from 'primeng/galleria';

@Component({
  selector: 'app-slidar',
  standalone: true,
  imports: [CommonModule, GalleriaModule],
  templateUrl: './slidar.component.html',
  styleUrl: './slidar.component.scss',
})
export class SlidarComponent implements OnInit {
  constructor(private sliderSeervice: SliderService) {}
  imagesUrl: string[] = [];
  ngOnInit(): void {
    this.sliderSeervice.getAllAds().subscribe((sliders: Slider[]) => {
      this.imagesUrl = sliders.map(
        (slider) => Constants.SLIDER_DOWNLOAD_IMAGE_AOI + slider.imageUrl
      );
      console.log(this.imagesUrl);
    });
  }
  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5,
    },
    {
      breakpoint: '768px',
      numVisible: 3,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
    },
  ];
}
