import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DocumentPicker } from '../../shared/document-picker/document-picker';
import { errorMessage } from '../../shared/error-message';
import { FilesService } from '../../shared/files.service';
import { CertificateModel, WebPkiService } from '../../shared/web-pki.service';

/** The response of POST /api/xml-signature-pki-sdk/start (see XmlSignaturePkiSdkController.cs). */
interface StartResponse {
  transferDataId: string;
  /** Base64. */
  toSignHash: string;
  digestAlgorithmOid: string;
}

/** The response of POST /api/xml-signature-pki-sdk/complete. */
interface CompleteResponse {
  signedFileId: string;
}

/**
 * XML signature with PKI SDK. The user picks an XML document and one of their certificates; the
 * server computes the hash to sign, Web PKI signs it with the certificate's private key, and the
 * server finishes the signed XML.
 */
@Component({
  selector: 'app-xml-signature-pki-sdk',
  imports: [DocumentPicker, RouterLink],
  templateUrl: './xml-signature-pki-sdk.html',
  styleUrl: './xml-signature-pki-sdk.css',
})
export class XmlSignaturePkiSdk implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly webPki = inject(WebPkiService);
  protected readonly files = inject(FilesService);

  protected readonly fileId = signal<string | null>(null);
  protected readonly certificates = signal<CertificateModel[]>([]);
  protected readonly selectedThumbprint = signal('');
  protected readonly loadingCertificates = signal(true);
  protected readonly busy = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly signedFileId = signal<string | null>(null);

  ngOnInit(): Promise<void> {
    return this.loadCertificates();
  }

  /** Lists the user's certificates with Web PKI. */
  protected async loadCertificates(): Promise<void> {
    this.loadingCertificates.set(true);
    this.error.set(null);
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

  protected async sign(): Promise<void> {
    const fileId = this.fileId();
    const thumbprint = this.selectedThumbprint();
    if (!fileId || !thumbprint) {
      return;
    }
    this.busy.set(true);
    this.error.set(null);
    try {
      // 1. Read the certificate (public part only) and send it to the server, which computes the
      //    hash to sign. A failed start (such as an untrusted certificate) is an HTTP error, so it
      //    throws here and the signature stops.
      const certContent = await this.webPki.readCertificate(thumbprint);
      const start = await firstValueFrom(
        this.http.post<StartResponse>('/api/xml-signature-pki-sdk/start', { fileId, certContent }),
      );

      // 2. Sign the hash with the certificate's private key, which never leaves this computer.
      const signature = await this.webPki.signHash(thumbprint, start.toSignHash, start.digestAlgorithmOid);

      // 3. Send the signature value to the server, which finishes the signed XML. The server kept
      //    the document with the transfer data, so it signs the same one as in step 1.
      const complete = await firstValueFrom(
        this.http.post<CompleteResponse>('/api/xml-signature-pki-sdk/complete', {
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

  /** Starts over with another document. */
  protected reset(): void {
    this.fileId.set(null);
    this.signedFileId.set(null);
    this.error.set(null);
  }

  protected certificateLabel(certificate: CertificateModel): string {
    const expires = new Date(certificate.validityEnd).toLocaleDateString();
    return `${certificate.subjectName} (issued by ${certificate.issuerName}, expires ${expires})`;
  }
}
