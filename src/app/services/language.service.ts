import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private languageKey = 'selectedLanguage';
  public languageChangedSubject = new BehaviorSubject<string>(
    this.getLanguage() || 'en'
  );
  languageChanged = this.languageChangedSubject.asObservable();

  constructor(private translate: TranslateService, private router: Router) {
    const savedLanguage = this.getLanguage();
    if (savedLanguage) {
      this.setLanguage(savedLanguage);
    } else {
      this.setLanguage('en'); // Default language
    }

    // Watch for route changes to handle direction updates
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.handleRouteDirection(event.urlAfterRedirects);
      }
    });
  }

  setLanguage(language: string) {
    localStorage.setItem(this.languageKey, language);
    this.translate.use(language);
    this.languageChangedSubject.next(language); // Notify subscribers
    this.handleRouteDirection(this.router.url); // Apply direction based on current route
  }

  getLanguage(): string {
    const language = localStorage.getItem(this.languageKey);
    return language == null ? 'en' : language;
  }

  private handleRouteDirection(url: string) {
    const htmlTag = document.getElementsByTagName('html')[0] as HTMLHtmlElement;

    // تطبيق التعديلات فقط على الصفحات التي تبدأ بـ '/home'
    if (url.startsWith('/home')) {
      this.updateDirection(this.getLanguage());
    } else {
      // إعادة تعيين الإعدادات الافتراضية للاتجاه للصفحات الأخرى
      htmlTag.setAttribute('dir', 'ltr');
    }
  }

  private updateDirection(language: string) {
    const htmlTag = document.getElementsByTagName('html')[0] as HTMLHtmlElement;
    if (language === 'ar') {
      htmlTag.setAttribute('dir', 'rtl');
    } else {
      htmlTag.setAttribute('dir', 'ltr');
    }
  }
}
