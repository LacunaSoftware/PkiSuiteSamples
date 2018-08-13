import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ListCertComponent } from './list-cert/list-cert.component';
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

const routes: Routes = [
  { path: '', component: HomeComponent, data: { page: 'home' }},
  { path: 'list-cert', component: ListCertComponent, data: { page: 'list-cert' } },
  { path: 'read-cert', component: ReadCertComponent, data: { page: 'read-cert' } },
  { path: 'rsa', component: RsaComponent, data: { page: 'rsa' } },
  { path: 'auth-cert', component: AuthCertComponent, data: { page: 'auth-cert' } },
  { path: 'issue-cert-user', component: IssueCertUserComponent, data: { page: 'issue-cert-user' } },
  { path: 'issue-cert-server', component: IssueCertServerComponent, data: { page: 'issue-cert-server' } },
  { path: 'sign-pdf-server', component: SignPdfServerComponent, data: { page: 'sign-pdf-server' } },
  { path: 'sign-pdf-user', component: SignPdfUserComponent, data: { page: 'sidn-pdf-user' } },
  { path: 'sign-multi-pdf-server', component: SignMultiPdfServerComponent, data: { page: 'sign-multi-pdf-server' } },
  { path: 'sign-multi-pdf-user', component: SignMultiPdfUserComponent, data: { page: 'sign-multi-pdf-user' } },
  { path: 'cosign-pdf', component: CosignPdfComponent, data: { page: 'cosign-pdf' } },
  { path: 'validate-pdf-sig', component: ValidatePdfSigComponent, data: { page: 'validate-pdf-sig' } },
  { path: 'printer-friendly', component: PrinterFriendlyComponent, data: { page: 'printer-friendly' } },
  { path: 'sign-cms-server', component: SignCmsServerComponent, data: { page: 'sign-cms-server' } },
  { path: 'sign-cms-user', component: SignCmsUserComponent, data: { page: 'sign-cms-user' } },
  { path: 'sign-multi-cms-server', component: SignMultiCmsServerComponent, data: { page: 'sign-multi-cms-server' } },
  { path: 'sign-multi-cms-user', component: SignMultiCmsUserComponent, data: { page: 'sign-multi-cms-user' } },
  { path: 'cosign-cms', component: CosignCmsComponent, data: { page: 'cosign-cms' } },
  { path: 'validate-cms-sig', component: ValidateCmsSigComponent, data: { page: 'validate-cms-sig' } },
  { path: 'sign-xml-server', component: SignXmlServerComponent, data: { page: 'sign-xml-server' } },
  { path: 'sign-xml-user', component: SignXmlUserComponent, data: { page: 'sign-xml-user' } },
  { path: 'sign-nfe', component: SignNfeComponent, data: { page: 'sign-nfe' } },
  { path: 'sign-cod', component: SignCodComponent, data: { page: 'sign-cod' } },
  { path: 'validate-xml-sig', component: ValidateXmlSigComponent, data: { page: 'validate-xml-sig' } }
]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
