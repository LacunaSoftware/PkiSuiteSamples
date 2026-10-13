import { provideHttpClient, withXhr } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { ConfigurationService } from './shared/configuration.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withXhr()),
    // withComponentInputBinding: route and query parameters (such as ?fileId=...) bind to the
    // component inputs of the same name.
    provideRouter(routes, withComponentInputBinding()),
    // Fetch the server's settings (such as the Web PKI license) before the app starts.
    provideAppInitializer(() => inject(ConfigurationService).load()),
  ]
};
