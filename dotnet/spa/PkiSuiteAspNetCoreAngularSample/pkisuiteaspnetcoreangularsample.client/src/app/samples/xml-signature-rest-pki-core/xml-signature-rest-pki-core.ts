import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ConfigurationService } from '../../shared/configuration.service';
import { DocumentPicker } from '../../shared/document-picker/document-picker';
import { errorMessage, errorValidationResults } from '../../shared/error-message';
import { FilesService } from '../../shared/files.service';
import { CertificateModel, WebPkiService } from '../../shared/web-pki.service';

/** The response of POST /api/xml-signature-rest-pki-core/start (see XmlSignatureRestPkiCoreController.cs). */
interface StartResponse {
  /** Base64. */
  toSignHash: string;
  digestAlgorithmOid: string;
  /** The signature state, sent back on the complete step. */
  state: string;
}

/** The response of POST /api/xml-signature-rest-pki-core/complete. */
interface CompleteResponse {
  signedFileId: string;
}

/**
 * XML signature with Rest PKI Core. The user picks an XML document and one of their certificates;
 * the server has Rest PKI Core compute the hash to sign, Web PKI signs it with the certificate's
 * private key, and the server has Rest PKI Core finish the signed XML.
 */
@Component({
  selector: 'app-xml-signature-rest-pki-core',
  imports: [DocumentPicker, RouterLink],
  templateUrl: './xml-signature-rest-pki-core.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './xml-signature-rest-pki-core.css',
})
export class XmlSignatureRestPkiCore implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly webPki = inject(WebPkiService);
  protected readonly files = inject(FilesService);
  protected readonly configuration = inject(ConfigurationService);

  protected readonly fileId = signal<string | null>(null);
  protected readonly certificates = signal<CertificateModel[]>([]);
  protected readonly selectedThumbprint = signal('');
  protected readonly loadingCertificates = signal(true);
  protected readonly busy = signal(false);
  protected readonly error = signal<string | null>(null);
  /** Validation results that came with the error, such as why the certificate was rejected. */
  protected readonly failedValidationResults = signal<string | null>(null);
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
    this.failedValidationResults.set(null);
    try {
      // 1. Read the certificate (public part only) and send it to the server, which has Rest PKI
      //    Core prepare the signature. A failed start (such as an untrusted certificate) is an
      //    HTTP error, so it throws here and the signature stops.
      const certContent = await this.webPki.readCertificate(thumbprint);
      const start = await firstValueFrom(
        this.http.post<StartResponse>('/api/xml-signature-rest-pki-core/start', { fileId, certContent }),
      );

      // 2. Sign the hash with the certificate's private key, which never leaves this computer.
      const signature = await this.webPki.signHash(thumbprint, start.toSignHash, start.digestAlgorithmOid);

      // 3. Send the signature value and the state to the server, which has Rest PKI Core finish
      //    the signed XML.
      const complete = await firstValueFrom(
        this.http.post<CompleteResponse>('/api/xml-signature-rest-pki-core/complete', {
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

  /** Starts over with another document. */
  protected reset(): void {
    this.fileId.set(null);
    this.signedFileId.set(null);
    this.error.set(null);
    this.failedValidationResults.set(null);
  }

  protected certificateLabel(certificate: CertificateModel): string {
    const expires = new Date(certificate.validityEnd).toLocaleDateString();
    return `${certificate.subjectName} (issued by ${certificate.issuerName}, expires ${expires})`;
  }
}
