import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CompleteSignatureRequest,
  CompleteSignatureResponse,
  OpenPadesSignatureResponse,
  StartSignatureRequest,
  StartSignatureResponse,
  XmlNFeCompleteSignatureResponse,
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

  completeXmlNFeSignature(request: CompleteSignatureRequest): Observable<XmlNFeCompleteSignatureResponse> {
    return this.http.post<XmlNFeCompleteSignatureResponse>(`/api/XmlNFeSignatureRest/Complete`, request);
  }

  openPadesSignature(request: string): Observable<OpenPadesSignatureResponse> {
    return this.http.get<OpenPadesSignatureResponse>(`/api/OpenPadesRest/` + request);
  }
}
