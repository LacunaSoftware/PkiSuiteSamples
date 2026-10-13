import { HttpClient } from '@angular/common/http';
import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DocumentPicker } from '../../shared/document-picker/document-picker';
import { ConfigurationService } from '../../shared/configuration.service';
import { errorMessage } from '../../shared/error-message';
import { FilesService } from '../../shared/files.service';

/** The response of POST /api/timestamp-pdf-rest-pki-core (see TimestampPdfRestPkiCoreController.cs). */
interface StampResponse {
  stampedFileId: string;
}

/**
 * Adds a document timestamp to a PDF with Rest PKI Core. The server does all the work in one call,
 * and nobody signs anything, so this page does not use Web PKI: it only sends the chosen PDF's file
 * id to the server and links to the timestamped PDF.
 */
@Component({
  selector: 'app-timestamp-pdf-rest-pki-core',
  imports: [RouterLink, DocumentPicker],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './timestamp-pdf-rest-pki-core.html',
})
export class TimestampPdfRestPkiCore {
  private readonly http = inject(HttpClient);
  protected readonly files = inject(FilesService);
  protected readonly configuration = inject(ConfigurationService);

  protected readonly stampedFileId = signal<string | null>(null);
  protected readonly busy = signal(false);
  protected readonly error = signal<string | null>(null);

  protected async stamp(fileId: string): Promise<void> {
    this.error.set(null);
    this.busy.set(true);
    try {
      // The server sends the PDF to Rest PKI Core, which adds the timestamp, and stores the result.
      const response = await firstValueFrom(this.http.post<StampResponse>('/api/timestamp-pdf-rest-pki-core', { fileId }));
      this.stampedFileId.set(response.stampedFileId);
    } catch (error) {
      this.error.set(errorMessage(error));
    } finally {
      this.busy.set(false);
    }
  }
}
