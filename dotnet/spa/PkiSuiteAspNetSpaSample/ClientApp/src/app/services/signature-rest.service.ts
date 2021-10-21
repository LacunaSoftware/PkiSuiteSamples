import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CompleteAuthenticationRequest,
  CompleteAuthenticationResponse,
  CompleteSignatureRequest,
  CompleteSignatureResponse,
  OpenPadesSignatureResponse,
  StartAuthenticationResponse,
  StartSignatureRequest,
  StartSignatureResponse,
} from '../api/rest/signature';

@Injectable({
  providedIn: 'root'
})
export class SignatureRestService {

  constructor(private http: HttpClient) { }

  startCadesSignature(request: StartSignatureRequest): Observable<StartSignatureResponse> {
    return this.http.post<StartSignatureResponse>(`/api/CadesSignatureRest/Start`, request);
  }

  completeCadesSignature(request: CompleteSignatureRequest): Observable<CompleteSignatureResponse> {
    return this.http.post<CompleteSignatureResponse>(`/api/CadesSignatureRest/Complete`, request);
  }

  startPadesSignature(request: StartSignatureRequest): Observable<StartSignatureResponse> {
    return this.http.post<StartSignatureResponse>(`/api/PadesSignatureRest/Start`, request);
  }

  completePadesSignature(request: CompleteSignatureRequest): Observable<CompleteSignatureResponse> {
    return this.http.post<CompleteSignatureResponse>(`/api/PadesSignatureRest/Complete`, request);
  }

  startXmlNFeSignature(): Observable<CompleteSignatureRequest> {
    return this.http.get<CompleteSignatureRequest>(`/api/XmlNFeSignatureRest/Start`);
  }

  completeXmlNFeSignature(request: CompleteSignatureRequest): Observable<CompleteSignatureResponse> {
    return this.http.post<CompleteSignatureResponse>(`/api/XmlNFeSignatureRest/Complete`, request);
  }

  startXmlSignature(): Observable<CompleteSignatureRequest> {
    return this.http.get<CompleteSignatureRequest>(`/api/XmlSignatureRest/Start`);
  }

  completeXmlSignature(request: CompleteSignatureRequest): Observable<CompleteSignatureResponse> {
    return this.http.post<CompleteSignatureResponse>(`/api/XmlSignatureRest/Complete`, request);
  }

  openPadesSignature(request: string): Observable<OpenPadesSignatureResponse> {
    return this.http.get<OpenPadesSignatureResponse>(`/api/OpenPadesRest/` + request);
  }

  startAuthentication(): Observable<StartAuthenticationResponse> {
    return this.http.get<StartAuthenticationResponse>(`/api/AuthenticationRest/Start`);
  }

  completeAuthentication(request: CompleteAuthenticationRequest): Observable<CompleteAuthenticationResponse> {
    return this.http.post<CompleteAuthenticationResponse>(`/api/AuthenticationRest/Complete`, request);
  }
}
