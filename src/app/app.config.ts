import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { InitializationService } from '@services/initialization.service';
import { routes } from './app.routes';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateLoader } from './translate-loader'; // تأكد من تحديث المسار إذا لزم الأمر
import { MatSelectCountryModule } from '@angular-material-extensions/select-country';
import { tokenInterceptor } from './interceptors/token.interceptor';

export function initializeApp(
  initService: InitializationService
): () => Promise<any> {
  return () =>
    initService
      .getUserCountry()
      .then((country) => {
        sessionStorage.setItem('userCountry', country);
      })
      .catch((error) => {
        const defaultCountry = 'US';
        sessionStorage.setItem('userCountry', defaultCountry);
        return Promise.resolve(defaultCountry);
      });
}

export const appConfig: ApplicationConfig = {
  providers: [
    // Here we use the HttpClient setup with the HttpInterceptorFn for standalone
    provideHttpClient(withInterceptors([tokenInterceptor])),

    provideRouter(routes),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient],
        },
      }),
      MatSelectCountryModule.forRoot('en') // تضمين MatSelectCountryModule بشكل صحيح هنا
    ),
    provideAnimationsAsync(),
    InitializationService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [InitializationService],
      multi: true,
    },
  ],
};
