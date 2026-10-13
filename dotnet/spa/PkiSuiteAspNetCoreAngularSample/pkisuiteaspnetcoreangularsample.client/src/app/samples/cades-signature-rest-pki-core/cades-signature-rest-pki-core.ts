import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ConfigurationService } from '../../shared/configuration.service';
import { DocumentPicker } from '../../shared/document-picker/document-picker';
import { errorMessage, errorValidationResults } from '../../shared/error-message';
import { FilesService } from '../../shared/files.service';
import { CertificateModel, WebPkiService } from '../../shared/web-pki.service';

/** The response of POST api/cades-signature-rest-pki-core/start (CadesSignatureRestPkiCoreController.cs). */
interface StartResponse {
  /** The hash to sign (Base64). */
  toSignHash: string;
  /** The OID of the digest algorithm to sign the hash with. */
  digestAlgorithmOid: string;
  /** The signature state from Rest PKI Core, to send back on the complete step. */
  state: string;
}

/** The response of POST api/cades-signature-rest-pki-core/complete. */
interface CompleteResponse {
  signedFileId: string;
}

/**
 * CAdES signature with Rest PKI Core (sample "cades-signature-rest-pki-core"): signs any file,
 * producing a CMS signature (.p7s). Unlike the PKI SDK sample, it does not co-sign existing .p7s
 * files, because Rest PKI Core has no option for that.
 *
 * The flow (AGENTS.md section 5b): Web PKI reads the user's certificate, the server's start step
 * has Rest PKI Core prepare the signature and returns the hash to sign and the signature state,
 * Web PKI signs the hash with the certificate's private key (which never leaves the user's
 * computer), and the server's complete step has Rest PKI Core finish the signature.
 */
@Component({
  selector: 'app-cades-signature-rest-pki-core',
  imports: [DocumentPicker, RouterLink],
  templateUrl: './cades-signature-rest-pki-core.html',
})
export class CadesSignatureRestPkiCore implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly webPki = inject(WebPkiService);
  protected readonly files = inject(FilesService);
  protected readonly configuration = inject(ConfigurationService);

  protected readonly fileId = signal<string | null>(null);
  protected readonly certificates = signal<CertificateModel[]>([]);
  protected readonly selectedThumbprint = signal('');
  protected readonly busy = signal(false);
  protected readonly error = signal<string | null>(null);
  /** Validation results that came with the error, such as why the certificate was rejected. */
  protected readonly failedValidationResults = signal<string | null>(null);
  protected readonly signedFileId = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    await this.loadCertificates();
  }

  protected async loadCertificates(): Promise<void> {
    this.error.set(null);
    try {
      const certificates = await this.webPki.listCertificates();
      this.certificates.set(certificates);
      this.selectedThumbprint.set(certificates[0]?.thumbprint ?? '');
    } catch (error) {
      this.error.set(errorMessage(error));
    }
  }

  protected isExpired(certificate: CertificateModel): boolean {
    return new Date(certificate.validityEnd) < new Date();
  }

  /** Starts over with a new document. */
  protected restart(): void {
    this.fileId.set(null);
    this.signedFileId.set(null);
    this.error.set(null);
    this.failedValidationResults.set(null);
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
      // 1. Read the certificate (its public part only) and send it to the server's start step.
      const certContent = await this.webPki.readCertificate(thumbprint);
      // If Rest PKI Core rejects the certificate the server answers with an error, which throws
      // here, so we never sign anything that was not accepted.
      const start = await firstValueFrom(this.http.post<StartResponse>('/api/cades-signature-rest-pki-core/start', {
        fileId,
        certContent,
      }));

      // 2. Sign the hash with the certificate's private key.
      const signature = await this.webPki.signHash(thumbprint, start.toSignHash, start.digestAlgorithmOid);

      // 3. Send the signature value and the state to the server's complete step.
      const complete = await firstValueFrom(this.http.post<CompleteResponse>('/api/cades-signature-rest-pki-core/complete', {
        state: start.state,
        signature,
      }));
      this.signedFileId.set(complete.signedFileId);
    } catch (error) {
      this.error.set(errorMessage(error));
      this.failedValidationResults.set(errorValidationResults(error));
    } finally {
      this.busy.set(false);
    }
  }
}
