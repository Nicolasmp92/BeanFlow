import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { httpErrorInterceptor } from './core/http-error.interceptor';
import { ssrCookieInterceptor } from './core/ssr-cookie.interceptor';
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch(), withInterceptors([ssrCookieInterceptor, httpErrorInterceptor])),
    // withComponentInputBinding: /cuenta/:id llega a CuentaPage por input().
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(),
  ],
};
