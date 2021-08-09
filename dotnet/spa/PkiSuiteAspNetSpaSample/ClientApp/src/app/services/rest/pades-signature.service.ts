import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompleteSignatureRequest, CompleteSignatureResponse, StartSignatureRequest, StartSignatureResponse } from '../../api/rest/signature';

@Injectable({
  providedIn: 'root'
})
export class PadesSignatureService {

  constructor(private http: HttpClient) { }

  startPadesSignature(request: StartSignatureRequest): Observable<StartSignatureResponse> {
    return this.http.post<StartSignatureResponse>(`/api/PadesSignatureRest/Start`, request);
  }

  completePadesSignature(request: CompleteSignatureRequest): Observable<CompleteSignatureResponse> {
    return this.http.post<CompleteSignatureResponse>(`/api/PadesSignatureRest/Complete`, request);
  }
}
