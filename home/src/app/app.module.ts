import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ListCertComponent } from './list-cert/list-cert.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { ReadCertComponent } from './read-cert/read-cert.component';
import { RsaComponent } from './rsa/rsa.component';
import { AuthCertComponent } from './auth-cert/auth-cert.component';
import { IssueCertUserComponent } from './issue-cert-user/issue-cert-user.component';
import { IssueCertServerComponent } from './issue-cert-server/issue-cert-server.component';
import { SignPdfServerComponent } from './sign-pdf-server/sign-pdf-server.component';
import { SignPdfUserComponent } from './sign-pdf-user/sign-pdf-user.component';
import { SignMultiPdfServerComponent } from './sign-multi-pdf-server/sign-multi-pdf-server.component';
import { SignMultiPdfUserComponent } from './sign-multi-pdf-user/sign-multi-pdf-user.component';
import { CosignPdfComponent } from './cosign-pdf/cosign-pdf.component';
import { ValidatePdfSigComponent } from './validate-pdf-sig/validate-pdf-sig.component';
import { SignCmsServerComponent } from './sign-cms-server/sign-cms-server.component';
import { SignCmsUserComponent } from './sign-cms-user/sign-cms-user.component';
import { SignMultiCmsServerComponent } from './sign-multi-cms-server/sign-multi-cms-server.component';
import { SignMultiCmsUserComponent } from './sign-multi-cms-user/sign-multi-cms-user.component';
import { CosignCmsComponent } from './cosign-cms/cosign-cms.component';
import { ValidateCmsSigComponent } from './validate-cms-sig/validate-cms-sig.component';
import { SignXmlServerComponent } from './sign-xml-server/sign-xml-server.component';
import { SignXmlUserComponent } from './sign-xml-user/sign-xml-user.component';
import { SignNfeComponent } from './sign-nfe/sign-nfe.component';
import { SignCodComponent } from './sign-cod/sign-cod.component';
import { ValidateXmlSigComponent } from './validate-xml-sig/validate-xml-sig.component';
import { PrinterFriendlyComponent } from './printer-friendly/printer-friendly.component';
import { SampleRestpkiComponent } from './sample-restpki/sample-restpki.component';
import { SamplePkisdkComponent } from './sample-pkisdk/sample-pkisdk.component';
import { SampleWebpkiComponent } from './sample-webpki/sample-webpki.component';
import { SampleAmpliaComponent } from './sample-amplia/sample-amplia.component';
import { SamplePkiexpressComponent } from './sample-pkiexpress/sample-pkiexpress.component';
import { PayOptionsService } from './pay-options.service';
import { ConfigComponent } from './config/config.component';

@NgModule({
  declarations: [
    AppComponent,
    ListCertComponent,
    HomeComponent,
    ReadCertComponent,
    RsaComponent,
    AuthCertComponent,
    IssueCertUserComponent,
    IssueCertServerComponent,
    SignPdfServerComponent,
    SignPdfUserComponent,
    SignMultiPdfServerComponent,
    SignMultiPdfUserComponent,
    CosignPdfComponent,
    ValidatePdfSigComponent,
    SignCmsServerComponent,
    SignCmsUserComponent,
    SignMultiCmsServerComponent,
    SignMultiCmsUserComponent,
    CosignCmsComponent,
    ValidateCmsSigComponent,
    SignXmlServerComponent,
    SignXmlUserComponent,
    SignNfeComponent,
    SignCodComponent,
    ValidateXmlSigComponent,
    PrinterFriendlyComponent,
    SampleRestpkiComponent,
    SamplePkisdkComponent,
    SampleWebpkiComponent,
    SampleAmpliaComponent,
    SamplePkiexpressComponent,
    ConfigComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule
  ],
  providers: [PayOptionsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
