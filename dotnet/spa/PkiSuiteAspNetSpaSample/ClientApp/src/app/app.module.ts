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
import { PadesSignatureSdkComponent } from './components/pades-signature-sdk/pades-signature-sdk.component';
import { PadesSignatureRestComponent } from './components/pades-signature-rest/pades-signature-rest.component';
import { StartupService } from './services/startup.service';
import { InitErrorGuard, InitSuccessGuard } from './guards/init.guard';
import { ServiceUnavailableComponent } from './components/service-unavailable/service-unavailable.component';
import { CadesSignatureSdkComponent } from './components/cades-signature-sdk/cades-signature-sdk.component';
import { CadesSignatureRestComponent } from './components/cades-signature-rest/cades-signature-rest.component';
import { SignatureSdkService } from './services/signature-sdk.service';
import { SignatureRestService } from './services/signature-rest.service';
import { XmlNFeSignatureSdkComponent } from './components/xml-nfe-signature-sdk/xml-nfe-signature-sdk.component';
import { XmlNFeSignatureRestComponent } from './components/xml-nfe-signature-rest/xml-nfe-signature-rest.component';
import { OpenPadesSdkComponent } from './components/open-pades-sdk/open-pades-sdk.component';
import { OpenPadesRestComponent } from './components/open-pades-rest/open-pades-rest.component';
import { XmlSignatureRestComponent } from './components/xml-signature-rest/xml-signature-rest.component';
import { XmlSignatureSdkComponent } from './components/xml-signature-sdk/xml-signature-sdk.component';
import { AuthenticationSdkComponent } from './components/authentication-sdk/authentication-sdk.component';
import { AuthenticationRestComponent } from './components/authentication-rest/authentication-rest.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    ServerFilesComponent,
    PadesSignatureSdkComponent,
    PadesSignatureRestComponent,
    OpenPadesSdkComponent,
    OpenPadesRestComponent,
    CadesSignatureSdkComponent,
    CadesSignatureRestComponent,
    XmlNFeSignatureSdkComponent,
    XmlNFeSignatureRestComponent,
    XmlSignatureSdkComponent,
    XmlSignatureRestComponent,
    ServiceUnavailableComponent,
    AuthenticationSdkComponent,
    AuthenticationRestComponent,
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
          { path: 'open-pades-sdk', component: OpenPadesSdkComponent },
          { path: 'open-pades-rest', component: OpenPadesRestComponent },
          { path: 'cades-signature-sdk', component: CadesSignatureSdkComponent },
          { path: 'cades-signature-rest', component: CadesSignatureRestComponent },
          { path: 'xml-nfe-signature-sdk', component: XmlNFeSignatureSdkComponent },
          { path: 'xml-nfe-signature-rest', component: XmlNFeSignatureRestComponent },
          { path: 'xml-signature-rest', component: XmlSignatureRestComponent },
          { path: 'xml-signature-sdk', component: XmlSignatureSdkComponent },
          { path: 'authentication-sdk', component: AuthenticationSdkComponent },
          { path: 'authentication-rest', component: AuthenticationRestComponent },
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
    SignatureSdkService,
    SignatureRestService,
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
