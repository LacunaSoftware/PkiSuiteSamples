import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { SampleDocument } from './sample-documents';

/** Calls FilesController.cs: gets documents to the server and links to download them. */
@Injectable({ providedIn: 'root' })
export class FilesService {
  private readonly http = inject(HttpClient);

  /** Uploads a file and returns its file id. */
  async upload(file: File): Promise<string> {
    const form = new FormData();
    form.append('file', file, file.name);
    const response = await firstValueFrom(this.http.post<{ fileId: string }>('/api/files', form));
    return response.fileId;
  }

  /** Has the server copy a sample document to its storage, and returns the copy's file id. */
  async useSample(document: SampleDocument): Promise<string> {
    const response = await firstValueFrom(this.http.post<{ fileId: string }>(`/api/files/samples/${document}`, null));
    return response.fileId;
  }

  /** URL to download a stored file, such as a signed document. */
  downloadUrl(fileId: string): string {
    return `/api/files/${encodeURIComponent(fileId)}`;
  }

  /** URL to download a sample document. */
  sampleDownloadUrl(document: SampleDocument): string {
    return `/api/files/samples/${document}`;
  }
}
