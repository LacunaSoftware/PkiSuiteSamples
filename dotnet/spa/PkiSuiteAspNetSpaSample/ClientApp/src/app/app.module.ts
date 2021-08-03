import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgxLoadingModule } from 'ngx-loading';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { HomeComponent } from './components/home/home.component';
import { ServerFilesComponent } from './components/server-files/server-files.component';
import { SampleFilesService } from './services/sample-files.service';
import { PadesSignatureService } from './services/sdk/pades-signature.service';
import { PadesSignatureSdkComponent } from './components/pades-signature-sdk/pades-signature-sdk.component';
import { StartupService } from './services/startup.service';
import { InitErrorGuard, InitSuccessGuard } from './guards/init.guard';
import { ServiceUnavailableComponent } from './components/service-unavailable/service-unavailable.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    ServerFilesComponent,
    PadesSignatureSdkComponent,
    ServiceUnavailableComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    NgxLoadingModule.forRoot({}),
    RouterModule.forRoot([
      {
        path: '',
        canActivate: [InitSuccessGuard],
        children: [
          { path: 'server-files', component: ServerFilesComponent },
          { path: 'pades-signature-sdk', component: PadesSignatureSdkComponent },
        ]
      },
      {
        path: 'unavailable',
        component: ServiceUnavailableComponent,
        canActivate: [InitErrorGuard]
      }
    ])
  ],
  providers: [
    SampleFilesService,
    PadesSignatureService,
    StartupService,
    InitSuccessGuard,
    InitErrorGuard,
    {
      provide: APP_INITIALIZER,
      // Note on syntax of useFactory for APP_INITIALIZER: https://github.com/angular/angular/issues/9047#issuecomment-255597990
      useFactory: s => { return () => s.init(); },
      deps: [StartupService],
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
