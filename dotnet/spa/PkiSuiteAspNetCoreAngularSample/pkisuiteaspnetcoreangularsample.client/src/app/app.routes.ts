import { Routes } from '@angular/router';
import { Home } from './home/home';
import { NotFound } from './not-found/not-found';

// One lazy-loaded route per sample, at /<slug>. Each sample declares its own pages in
// samples/<slug>/routes.ts, so adding or changing a sample does not touch this file.
export const routes: Routes = [
  { path: '', component: Home },
  { path: 'pades-signature-pki-sdk', loadChildren: () => import('./samples/pades-signature-pki-sdk/routes') },
  { path: 'pades-signature-rest-pki-core', loadChildren: () => import('./samples/pades-signature-rest-pki-core/routes') },
  { path: 'cades-signature-pki-sdk', loadChildren: () => import('./samples/cades-signature-pki-sdk/routes') },
  { path: 'cades-signature-rest-pki-core', loadChildren: () => import('./samples/cades-signature-rest-pki-core/routes') },
  { path: 'xml-signature-pki-sdk', loadChildren: () => import('./samples/xml-signature-pki-sdk/routes') },
  { path: 'xml-signature-rest-pki-core', loadChildren: () => import('./samples/xml-signature-rest-pki-core/routes') },
  { path: 'xml-nfe-signature-pki-sdk', loadChildren: () => import('./samples/xml-nfe-signature-pki-sdk/routes') },
  { path: 'validate-pades-signature-pki-sdk', loadChildren: () => import('./samples/validate-pades-signature-pki-sdk/routes') },
  { path: 'validate-pades-signature-rest-pki-core', loadChildren: () => import('./samples/validate-pades-signature-rest-pki-core/routes') },
  { path: 'authentication-pki-sdk', loadChildren: () => import('./samples/authentication-pki-sdk/routes') },
  { path: 'authentication-rest-pki-core', loadChildren: () => import('./samples/authentication-rest-pki-core/routes') },
  { path: '**', component: NotFound },
];
