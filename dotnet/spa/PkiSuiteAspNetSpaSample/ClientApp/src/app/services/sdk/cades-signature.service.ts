import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompleteCadesSignatureRequest, CompleteCadesSignatureResponse, StartCadesSignatureRequest, StartCadesSignatureResponse } from '../../api/sdk/cades-signature';

@Injectable({
  providedIn: 'root'
})
export class CadesSignatureService {

  constructor(private http: HttpClient) { }

  startCadesSignature(request: StartCadesSignatureRequest): Observable<StartCadesSignatureResponse> {
    return this.http.post<StartCadesSignatureResponse>(`/api/CadesSignatureSdk/Start`, request);
  }

  completeCadesSignature(request: CompleteCadesSignatureRequest): Observable<CompleteCadesSignatureResponse> {
    return this.http.post<CompleteCadesSignatureResponse>(`/api/CadesSignatureSdk/Complete`, request);
  }
}
