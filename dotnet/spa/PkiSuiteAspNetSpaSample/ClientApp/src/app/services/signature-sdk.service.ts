import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  StartCadesSignatureRequest,
  StartCadesSignatureResponse,
  CompleteCadesSignatureRequest,
  CompleteSignatureRequest,
  CompleteSignatureResponse,
  StartSignatureRequest,
  StartSignatureResponse,
  StartAuthenticationResponse,
  CompleteAuthenticationRequest,
  CompleteAuthenticationResponse,
} from '../api/sdk/signature';
import {
  OpenPadesSignatureResponse,
} from '../api/sdk/pades-signature';

@Injectable({
  providedIn: 'root'
})
export class SignatureSdkService {

  constructor( private http: HttpClient ) { }

  startCadesSignature(request: StartCadesSignatureRequest): Observable<StartCadesSignatureResponse> {
    return this.http.post<StartCadesSignatureResponse>(`/api/CadesSignatureSdk/Start`, request);
  }

  completeCadesSignature(request: CompleteCadesSignatureRequest): Observable<CompleteSignatureResponse> {
    return this.http.post<CompleteSignatureResponse>(`/api/CadesSignatureSdk/Complete`, request);
  }

  startPadesSignature(request: StartSignatureRequest): Observable<StartSignatureResponse> {
    return this.http.post<StartSignatureResponse>(`/api/PadesSignatureSdk/Start`, request);
  }

  completePadesSignature(request: CompleteSignatureRequest): Observable<CompleteSignatureResponse> {
    return this.http.post<CompleteSignatureResponse>(`/api/PadesSignatureSdk/Complete`, request);
  }

  startXmlSignature(request: StartSignatureRequest): Observable<StartSignatureResponse> {
    return this.http.post<StartSignatureResponse>(`/api/XmlSignatureSdk/Start`, request);
  }

  completeXmlSignature(request: CompleteSignatureRequest): Observable<CompleteSignatureResponse> {
    return this.http.post<CompleteSignatureResponse>(`/api/XmlSignatureSdk/Complete`, request);
  }

  startXmlNFeSignature(request: StartSignatureRequest): Observable<StartSignatureResponse> {
    return this.http.post<StartSignatureResponse>(`/api/XmlNFeSignatureSdk/Start`, request);
  }

  completeXmlNFeSignature(request: CompleteSignatureRequest): Observable<CompleteSignatureResponse> {
    return this.http.post<CompleteSignatureResponse>(`/api/XmlNFeSignatureSdk/Complete`, request);
  }

  openPadesSignature(request: string): Observable<OpenPadesSignatureResponse> {
    return this.http.get<OpenPadesSignatureResponse>(`/api/OpenPadesSdk/` + request);
  }

  startAuthentication(): Observable<StartAuthenticationResponse> {
    return this.http.get<StartAuthenticationResponse>(`/api/AuthenticationSdk/Start`);
  }

  completeAuthentication(request: CompleteAuthenticationRequest): Observable<CompleteAuthenticationResponse> {
    return this.http.post<CompleteAuthenticationResponse>(`/api/AuthenticationSdk/Complete`, request);
  }
}
