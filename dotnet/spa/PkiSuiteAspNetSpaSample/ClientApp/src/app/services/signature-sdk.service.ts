import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CompleteCadesSignatureRequest,
  CompleteCadesSignatureResponse,
  StartCadesSignatureRequest,
  StartCadesSignatureResponse,
} from '../api/sdk/cades-signature';
import {
  CompleteXmlNFeSignatureRequest,
  CompleteXmlNFeSignatureResponse,
  StartXmlNFeSignatureRequest,
  StartXmlNFeSignatureResponse,
} from '../api/sdk/xml-signature';
import {
  CompletePadesSignatureRequest,
  CompletePadesSignatureResponse,
  StartPadesSignatureRequest,
  StartPadesSignatureResponse,
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

  completeCadesSignature(request: CompleteCadesSignatureRequest): Observable<CompleteCadesSignatureResponse> {
    return this.http.post<CompleteCadesSignatureResponse>(`/api/CadesSignatureSdk/Complete`, request);
  }

  startPadesSignature(request: StartPadesSignatureRequest): Observable<StartPadesSignatureResponse> {
    return this.http.post<StartPadesSignatureResponse>(`/api/PadesSignatureSdk/Start`, request);
  }

  completePadesSignature(request: CompletePadesSignatureRequest): Observable<CompletePadesSignatureResponse> {
    return this.http.post<CompletePadesSignatureResponse>(`/api/PadesSignatureSdk/Complete`, request);
  }

  startXmlNFeSignature(request: StartXmlNFeSignatureRequest): Observable<StartXmlNFeSignatureResponse> {
    return this.http.post<StartXmlNFeSignatureResponse>(`/api/XmlNFeSignatureSdk/Start`, request);
  }

  completeXmlNFeSignature(request: CompleteXmlNFeSignatureRequest): Observable<CompleteXmlNFeSignatureResponse> {
    return this.http.post<CompleteXmlNFeSignatureResponse>(`/api/XmlNFeSignatureSdk/Complete`, request);
  }

  openPadesSignature(request: string): Observable<OpenPadesSignatureResponse> {
    return this.http.get<OpenPadesSignatureResponse>(`/api/OpenPadesSdk/` + request);
  }
}
