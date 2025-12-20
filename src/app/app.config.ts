import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  type ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import {
  lucideCheck,
  lucideChevronLeft,
  lucideEdit,
  lucideMoon,
  lucidePlus,
  lucideSun,
  lucideTrash2,
  lucideX,
} from '@ng-icons/lucide';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideIcons({
      lucideSun,
      lucideMoon,
      lucideEdit,
      lucideTrash2,
      lucideCheck,
      lucideX,
      lucidePlus,
      lucideChevronLeft,
    }),
  ],
};
