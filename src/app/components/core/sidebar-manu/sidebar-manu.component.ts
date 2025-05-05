import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Course } from '@common/course';
import { SidebarComponent } from '@core/sidebar/sidebar.component';
import { TranslateModule } from '@ngx-translate/core';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { CertificateComponent } from 'app/components/home/home-page/courses/card-details/course-explanation/certificate/certificate.component';
import { ReviewComponent } from 'app/components/home/home-page/courses/review/review.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-sidebar-manu',
  standalone: true,
  imports: [
    CommonModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    RouterModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    SidebarComponent,
    ReviewComponent,
    PdfViewerModule,
    CertificateComponent,
    TranslateModule,
  ],
  templateUrl: './sidebar-manu.component.html',
  styleUrl: './sidebar-manu.component.scss',
})
export class SidebarManuComponent {
  @Input() course?: Course;
  @Input()language?: string;
}
