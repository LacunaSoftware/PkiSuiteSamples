import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject, input, linkedSignal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ConfigurationService } from '../../shared/configuration.service';
import { DocumentPicker } from '../../shared/document-picker/document-picker';
import { errorMessage, errorValidationResults } from '../../shared/error-message';
import { FilesService } from '../../shared/files.service';
import { CertificateModel, WebPkiService } from '../../shared/web-pki.service';

/** Response of POST /api/pades-signature-rest-pki-core/start (PadesSignatureRestPkiCoreController.cs). */
interface StartResponse {
  /** Rest PKI Core's state for this signature, to send back on the complete step. */
  state: string;
  /** The hash to sign (Base64). */
  toSignHash: string;
  /** OID of the digest algorithm to sign the hash with. */
  digestAlgorithmOid: string;
}

/** Response of POST /api/pades-signature-rest-pki-core/complete. */
interface CompleteResponse {
  signedFileId: string;
}

/**
 * PAdES signature with Rest PKI Core: the browser half of the start / signHash / complete flow.
 *
 * 1. Web PKI lists the user's certificates and reads the chosen one.
 * 2. The server's start step has Rest PKI Core prepare the signature, and returns the hash to sign
 *    and Rest PKI Core's state.
 * 3. Web PKI signs the hash with the certificate's private key, which never leaves the computer.
 * 4. The server's complete step sends the state and the signature to Rest PKI Core, which finishes
 *    the signature, and stores the signed PDF.
 */
@Component({
  selector: 'app-pades-signature-rest-pki-core',
  imports: [DocumentPicker, RouterLink],
  templateUrl: './pades-signature-rest-pki-core.html',
})
export class PadesSignatureRestPkiCore implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly webPki = inject(WebPkiService);
  protected readonly files = inject(FilesService);
  protected readonly configuration = inject(ConfigurationService);

  /** A file to sign given on the URL (?fileId=...), such as a signed PDF to sign again. */
  readonly fileId = input<string>();

  /** The PDF to sign: the one on the URL, or the one chosen with the document picker. */
  protected readonly documentId = linkedSignal<string | null>(() => this.fileId() ?? null);
  /** The signed PDF, once the signature is complete. Cleared when another document is chosen. */
  protected readonly signedFileId = linkedSignal<string | null, string | null>({
    source: this.documentId,
    computation: () => null,
  });

  protected readonly certificates = signal<CertificateModel[]>([]);
  protected readonly selectedThumbprint = signal('');
  protected readonly loadingCertificates = signal(true);
  protected readonly busy = signal(false);
  protected readonly error = signal<string | null>(null);
  /** Validation results that came with the error, such as why the certificate was rejected. */
  protected readonly failedValidationResults = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    try {
      const certificates = await this.webPki.listCertificates();
      this.certificates.set(certificates);
      this.selectedThumbprint.set(certificates[0]?.thumbprint ?? '');
    } catch (error) {
      this.error.set(errorMessage(error));
    } finally {
      this.loadingCertificates.set(false);
    }
  }

  protected certificateLabel(certificate: CertificateModel): string {
    const expired = new Date(certificate.validityEnd) < new Date() ? ' [EXPIRED]' : '';
    return `${certificate.subjectName} (issued by ${certificate.issuerName})${expired}`;
  }

  protected async sign(): Promise<void> {
    const fileId = this.documentId();
    const thumbprint = this.selectedThumbprint();
    if (!fileId || !thumbprint) {
      return;
    }
    this.busy.set(true);
    this.error.set(null);
    this.failedValidationResults.set(null);
    try {
      // 1. Read the chosen certificate (public, Base64 DER).
      const certContent = await this.webPki.readCertificate(thumbprint);

      // 2. Start: Rest PKI Core prepares the signature and returns the hash to sign. If it
      //    cannot (for instance, the certificate is not valid), the server answers with an error
      //    (HTTP 422) and firstValueFrom throws, so we never ask the user to sign.
      const start = await firstValueFrom(
        this.http.post<StartResponse>('/api/pades-signature-rest-pki-core/start', { fileId, certContent }),
      );

      // 3. Sign the hash with the certificate's private key.
      const signature = await this.webPki.signHash(thumbprint, start.toSignHash, start.digestAlgorithmOid);

      // 4. Complete: send Rest PKI Core's state back with the signature.
      const complete = await firstValueFrom(
        this.http.post<CompleteResponse>('/api/pades-signature-rest-pki-core/complete', {
          state: start.state,
          signature,
        }),
      );
      this.signedFileId.set(complete.signedFileId);
    } catch (error) {
      this.error.set(errorMessage(error));
      this.failedValidationResults.set(errorValidationResults(error));
    } finally {
      this.busy.set(false);
    }
  }
}
