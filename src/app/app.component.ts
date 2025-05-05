import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/core/header/header.component';
import { FooterComponent } from './components/core/footer/footer.component';
import { LanguageService } from '@services/language.service';
import { DragDropModule } from 'primeng/dragdrop';
import { UserExamDragAndDrop } from '@common/user-exam-drag-and-drop';
import { BasicInfoService } from '@services/basic-info.service';
import { BasicInfo } from '@common/basic-info';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    DragDropModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'E-learning-front';
  showWhatsAppIcon: boolean = false;
  basicInfoData?: BasicInfo;

  constructor(
    private languageService: LanguageService,
    private basicInfoService: BasicInfoService,

    private router: Router
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // إضافة الصفحات التي تريد ظهور الأيقونة فيها
        const pagesWithWhatsAppIcon = ['/home'];
        this.showWhatsAppIcon = pagesWithWhatsAppIcon.includes(this.router.url);
      }
    });
  }

  ngOnInit(): void {
    this.languageService.getLanguage();
    this.loadData();
  }
  loadData(): void {
    this.basicInfoService.gitbasicInfo().subscribe({
      next: (response) => {
        if (response !== null && response.length > 0) {
          this.basicInfoData = response[0];
        }
      },
      error: (error) => {},
    });
  }
}
