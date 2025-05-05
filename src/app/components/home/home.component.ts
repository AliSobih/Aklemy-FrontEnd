import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { FooterComponent } from '@core/footer/footer.component';
import { HeaderComponent } from '@core/header/header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterOutlet,
    FooterComponent,
    MatPaginatorModule,
    CommonModule,
    HttpClientModule,
    HeaderComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  showHeaderFooter = true;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // تحقق مما إذا كان الـ URL يحتوي على '/course/' لإخفاء الـ header والـ footer
        const url = this.router.url;
        this.showHeaderFooter = !(
          url.includes('/course/') ||
          url.includes('/courseExams/') ||
          url.includes('/ExamSections/')
        );
      }
    });
  }
}
