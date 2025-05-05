import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../common/category';
import { CourseService } from '../../../services/course.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '@services/language.service';
import { RouterModule } from '@angular/router';
import { BasicInfoService } from '@services/basic-info.service';
import { BasicInfo } from '@common/basic-info';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  categoryList: Category[] = [];
  basicInfoData?: BasicInfo;
  facebook: string | undefined = '';
  language: string = 'en';

  constructor(
    private categoryService: CategoryService,
    private courseService: CourseService,
    private translate: TranslateService,
    private languageService: LanguageService,
    private basicInfoService: BasicInfoService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadData();
    this.facebook = 'https://www.facebook.com';
  }

  loadCategories() {
    this.categoryService.getallData().subscribe((data) => {
      this.categoryList = data;
    });
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

  onSelectCategory(categoryId: number) {
    this.courseService.courseListUpdated.next(categoryId);
  }

  switchLanguage(language: string) {
    this.languageService.setLanguage(language);
    this.language = language;
  }
}
