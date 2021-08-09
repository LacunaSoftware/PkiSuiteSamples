import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompleteSignatureRequest, CompleteSignatureResponse, StartSignatureRequest, StartSignatureResponse } from '../../api/rest/signature';

@Injectable({
  providedIn: 'root'
})
export class CadesSignatureService {

  constructor(private http: HttpClient) { }

  startCadesSignature(request: StartSignatureRequest): Observable<StartSignatureResponse> {
    return this.http.post<StartSignatureResponse>(`/api/CadesSignatureRest/Start`, request);
  }

  completeCadesSignature(request: CompleteSignatureRequest): Observable<CompleteSignatureResponse> {
    return this.http.post<CompleteSignatureResponse>(`/api/CadesSignatureRest/Complete`, request);
  }
}
