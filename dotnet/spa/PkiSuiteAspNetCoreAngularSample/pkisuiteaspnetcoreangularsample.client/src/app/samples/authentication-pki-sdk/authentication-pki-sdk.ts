import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { errorMessage, errorValidationResults } from '../../shared/error-message';
import { CertificateModel, WebPkiService } from '../../shared/web-pki.service';

/** Response of POST /api/authentication-pki-sdk/start. */
interface StartResponse {
  /** The nonce (Base64) to be signed. */
  nonce: string;
  digestAlgorithmOid: string;
}

/** Response of POST /api/authentication-pki-sdk/complete. */
interface CompleteResponse {
  certificate: AuthenticatedCertificate;
  validationResults: string;
}

interface AuthenticatedCertificate {
  subjectName: string | null;
  emailAddress: string | null;
  issuerName: string | null;
  serialNumber: string;
  validityStart: string;
  validityEnd: string;
  thumbprintSha256: string;
  pkiBrazil: {
    certificateType: string;
    cpf: string | null;
    responsavel: string | null;
    dateOfBirth: string | null;
    companyName: string | null;
    cnpj: string | null;
    rgNumero: string | null;
    rgEmissor: string | null;
    rgEmissorUf: string | null;
    oabNumero: string | null;
    oabUf: string | null;
  } | null;
}

/**
 * Certificate authentication with PKI SDK: the server issues a nonce, Web PKI signs it with the
 * user's certificate (signData), and the server validates the signature and the certificate.
 */
@Component({
  selector: 'app-authentication-pki-sdk',
  imports: [FormsModule, RouterLink, DatePipe],
  templateUrl: './authentication-pki-sdk.html',
})
export class AuthenticationPkiSdk implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly webPki = inject(WebPkiService);

  protected readonly now = new Date();
  protected readonly certificates = signal<CertificateModel[]>([]);
  protected readonly selected = signal('');
  protected readonly busy = signal(false);
  protected readonly error = signal<string | null>(null);
  /** Validation results of a failed authentication, from the server's error response. */
  protected readonly failedValidationResults = signal<string | null>(null);
  protected readonly result = signal<CompleteResponse | null>(null);

  async ngOnInit(): Promise<void> {
    await this.loadCertificates();
  }

  protected async loadCertificates(): Promise<void> {
    this.busy.set(true);
    this.error.set(null);
    try {
      const certificates = await this.webPki.listCertificates();
      this.certificates.set(certificates);
      if (!certificates.some((c) => c.thumbprint === this.selected())) {
        this.selected.set(certificates[0]?.thumbprint ?? '');
      }
    } catch (error) {
      this.error.set(errorMessage(error));
    } finally {
      this.busy.set(false);
    }
  }

  protected isExpired(certificate: CertificateModel): boolean {
    return new Date(certificate.validityEnd) < this.now;
  }

  protected async signIn(): Promise<void> {
    const thumbprint = this.selected();
    this.busy.set(true);
    this.error.set(null);
    this.failedValidationResults.set(null);
    try {
      // 1. The server issues a nonce.
      const start = await firstValueFrom(this.http.post<StartResponse>('/api/authentication-pki-sdk/start', {}));

      // 2. Web PKI signs the nonce with the certificate's private key, which never leaves the
      //    user's computer. Note: signData, because the nonce is data, not a hash.
      const signature = await this.webPki.signData(thumbprint, start.nonce, start.digestAlgorithmOid);

      // 3. Send the certificate (public), the nonce and the signature to the server, which validates
      //    them. The server does not trust the certificate until that validation succeeds.
      const certContent = await this.webPki.readCertificate(thumbprint);
      this.result.set(await firstValueFrom(this.http.post<CompleteResponse>('/api/authentication-pki-sdk/complete', {
        nonce: start.nonce,
        certContent,
        signature,
      })));
    } catch (error) {
      this.error.set(errorMessage(error));
      this.failedValidationResults.set(errorValidationResults(error));
    } finally {
      this.busy.set(false);
    }
  }

  protected reset(): void {
    this.result.set(null);
    this.error.set(null);
    this.failedValidationResults.set(null);
  }
}
