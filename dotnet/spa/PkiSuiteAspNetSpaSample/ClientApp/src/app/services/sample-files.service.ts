import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SampleFilesService {

  constructor(private http: HttpClient) { }

  getFileId(id: string): Observable<string> {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.http.get(`/api/ServerFiles/${id}`, { headers, responseType: 'text' });
  }
}
