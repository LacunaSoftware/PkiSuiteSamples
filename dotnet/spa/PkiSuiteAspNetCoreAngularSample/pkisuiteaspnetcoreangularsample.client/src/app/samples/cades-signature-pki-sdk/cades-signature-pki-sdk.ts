import { HttpClient } from '@angular/common/http';
import { Component, OnInit, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DocumentPicker } from '../../shared/document-picker/document-picker';
import { errorMessage } from '../../shared/error-message';
import { FilesService } from '../../shared/files.service';
import { CertificateModel, WebPkiService } from '../../shared/web-pki.service';

/** The response of POST api/cades-signature-pki-sdk/start (CadesSignaturePkiSdkController.cs). */
interface StartResponse {
  /** Id of the data the complete step needs, which the server keeps. */
  transferDataId: string;
  /** The hash to sign (Base64). */
  toSignHash: string;
  /** The OID of the digest algorithm to sign the hash with. */
  digestAlgorithmOid: string;
}

/** The response of POST api/cades-signature-pki-sdk/complete. */
interface CompleteResponse {
  signedFileId: string;
}

/**
 * CAdES signature with PKI SDK (sample "cades-signature-pki-sdk"): signs any file, producing a CMS
 * signature (.p7s), or co-signs an existing .p7s.
 *
 * The flow (AGENTS.md section 5b): Web PKI reads the user's certificate, the server's start step
 * returns the hash to sign, Web PKI signs it with the certificate's private key (which never leaves
 * the user's computer), and the server's complete step builds the signature.
 */
@Component({
  selector: 'app-cades-signature-pki-sdk',
  imports: [DocumentPicker, RouterLink],
  templateUrl: './cades-signature-pki-sdk.html',
})
export class CadesSignaturePkiSdk implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly webPki = inject(WebPkiService);
  private readonly router = inject(Router);
  protected readonly files = inject(FilesService);

  /** Set by the query parameter ?cosignFileId=... : a .p7s to co-sign instead of a new document. */
  readonly cosignFileId = input<string>();

  /** The document picked by the user, when not co-signing. */
  protected readonly pickedFileId = signal<string | null>(null);
  /** The file the signature is computed on: the .p7s to co-sign, or the picked document. */
  protected readonly fileId = computed(() => this.cosignFileId() ?? this.pickedFileId());

  protected readonly certificates = signal<CertificateModel[]>([]);
  protected readonly selectedThumbprint = signal('');
  protected readonly busy = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly signedFileId = signal<string | null>(null);

  constructor() {
    // The "co-sign" link points back at this page, which Angular reuses: start over whenever the
    // file to co-sign changes.
    effect(() => {
      this.cosignFileId();
      untracked(() => this.reset());
    });
  }

  /** Starts over with a new document (leaving co-signature mode, if on). */
  protected restart(): void {
    this.reset();
    void this.router.navigate(['/cades-signature-pki-sdk']);
  }

  private reset(): void {
    this.pickedFileId.set(null);
    this.signedFileId.set(null);
    this.error.set(null);
  }

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

  protected async sign(): Promise<void> {
    const fileId = this.fileId();
    const thumbprint = this.selectedThumbprint();
    if (!fileId || !thumbprint) {
      return;
    }
    this.busy.set(true);
    this.error.set(null);
    try {
      // 1. Read the certificate (its public part only) and send it to the server's start step.
      const certContent = await this.webPki.readCertificate(thumbprint);
      // If the server rejects the certificate it answers with an error, which throws here, so we
      // never sign anything the server did not accept.
      const start = await firstValueFrom(this.http.post<StartResponse>('/api/cades-signature-pki-sdk/start', {
        fileId,
        certContent,
        cosign: !!this.cosignFileId(),
      }));

      // 2. Sign the hash with the certificate's private key.
      const signature = await this.webPki.signHash(thumbprint, start.toSignHash, start.digestAlgorithmOid);

      // 3. Send the signature value to the server's complete step, which builds the .p7s.
      const complete = await firstValueFrom(this.http.post<CompleteResponse>('/api/cades-signature-pki-sdk/complete', {
        transferDataId: start.transferDataId,
        signature,
      }));
      this.signedFileId.set(complete.signedFileId);
    } catch (error) {
      this.error.set(errorMessage(error));
    } finally {
      this.busy.set(false);
    }
  }
}
