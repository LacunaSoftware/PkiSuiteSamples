import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompletePadesSignatureRequest, CompletePadesSignatureResponse, StartPadesSignatureRequest, StartPadesSignatureResponse } from '../../api/rest/pades-signature';

@Injectable({
  providedIn: 'root'
})
export class PadesSignatureService {

  constructor(private http: HttpClient) { }

  startPadesSignature(request: StartPadesSignatureRequest): Observable<StartPadesSignatureResponse> {
    return this.http.post<StartPadesSignatureResponse>(`/api/PadesSignatureRest/Start`, request);
  }

  completePadesSignature(request: CompletePadesSignatureRequest): Observable<CompletePadesSignatureResponse> {
    return this.http.post<CompletePadesSignatureResponse>(`/api/PadesSignatureRest/Complete`, request);
  }
}
