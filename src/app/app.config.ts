import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { getSingleSpaExtraProviders } from 'single-spa-angular';
import { APP_BASE_HREF } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    getSingleSpaExtraProviders(),
    provideRouter(routes),
    { provide: APP_BASE_HREF, useValue: '/configforge' },
  ],
}