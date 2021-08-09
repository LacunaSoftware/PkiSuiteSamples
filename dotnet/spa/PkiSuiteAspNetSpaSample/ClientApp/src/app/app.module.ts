import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgxLoadingModule } from 'ngx-loading';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { ServerFilesComponent } from './components/server-files/server-files.component';
import { SampleFilesService } from './services/sample-files.service';
import { PadesSignatureService } from './services/sdk/pades-signature.service';
import { PadesSignatureSdkComponent } from './components/pades-signature-sdk/pades-signature-sdk.component';
import { PadesSignatureRestComponent } from './components/pades-signature-rest/pades-signature-rest.component';
import { StartupService } from './services/startup.service';
import { InitErrorGuard, InitSuccessGuard } from './guards/init.guard';
import { ServiceUnavailableComponent } from './components/service-unavailable/service-unavailable.component';
import { CadesSignatureSdkComponent } from './components/cades-signature-sdk/cades-signature-sdk.component';
import { CadesSignatureRestComponent } from './components/cades-signature-rest/cades-signature-rest.component';
import { CadesSignatureService } from './services/sdk/cades-signature.service';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    ServerFilesComponent,
    PadesSignatureSdkComponent,
    PadesSignatureRestComponent,
    CadesSignatureSdkComponent,
    CadesSignatureRestComponent,
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
          { path: 'pades-signature-rest', component: PadesSignatureRestComponent },
          { path: 'cades-signature-sdk', component: CadesSignatureSdkComponent },
          { path: 'cades-signature-rest', component: CadesSignatureRestComponent },
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
    CadesSignatureService,
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
