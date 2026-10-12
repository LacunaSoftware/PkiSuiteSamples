import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject, input, linkedSignal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DocumentPicker } from '../../shared/document-picker/document-picker';
import { errorMessage } from '../../shared/error-message';
import { FilesService } from '../../shared/files.service';
import { CertificateModel, WebPkiService } from '../../shared/web-pki.service';

/** Response of POST /api/pades-signature-pki-sdk/start (PadesSignaturePkiSdkController.cs). */
interface StartResponse {
  /** Id of the transfer data the server keeps for the complete step. */
  transferDataId: string;
  /** The hash to sign (Base64). */
  toSignHash: string;
  /** OID of the digest algorithm to sign the hash with. */
  digestAlgorithmOid: string;
}

/** Response of POST /api/pades-signature-pki-sdk/complete. */
interface CompleteResponse {
  signedFileId: string;
}

/**
 * PAdES signature with PKI SDK: the browser half of the start / signHash / complete flow.
 *
 * 1. Web PKI lists the user's certificates and reads the chosen one.
 * 2. The server's start step prepares the signature and returns the hash to sign.
 * 3. Web PKI signs the hash with the certificate's private key, which never leaves the computer.
 * 4. The server's complete step finishes the signature and stores the signed PDF.
 */
@Component({
  selector: 'app-pades-signature-pki-sdk',
  imports: [DocumentPicker, RouterLink],
  templateUrl: './pades-signature-pki-sdk.html',
})
export class PadesSignaturePkiSdk implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly webPki = inject(WebPkiService);
  protected readonly files = inject(FilesService);

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
    try {
      // 1. Read the chosen certificate (public, Base64 DER).
      const certContent = await this.webPki.readCertificate(thumbprint);

      // 2. Start: the server prepares the signature and returns the hash to sign. If the
      //    certificate is not valid, the server answers with an error (HTTP 422) and
      //    firstValueFrom throws, so we never ask the user to sign.
      const start = await firstValueFrom(
        this.http.post<StartResponse>('/api/pades-signature-pki-sdk/start', { fileId, certContent }),
      );

      // 3. Sign the hash with the certificate's private key.
      const signature = await this.webPki.signHash(thumbprint, start.toSignHash, start.digestAlgorithmOid);

      // 4. Complete: the server finishes the signature with the transfer data it kept.
      const complete = await firstValueFrom(
        this.http.post<CompleteResponse>('/api/pades-signature-pki-sdk/complete', {
          transferDataId: start.transferDataId,
          signature,
        }),
      );
      this.signedFileId.set(complete.signedFileId);
    } catch (error) {
      this.error.set(errorMessage(error));
    } finally {
      this.busy.set(false);
    }
  }
}
