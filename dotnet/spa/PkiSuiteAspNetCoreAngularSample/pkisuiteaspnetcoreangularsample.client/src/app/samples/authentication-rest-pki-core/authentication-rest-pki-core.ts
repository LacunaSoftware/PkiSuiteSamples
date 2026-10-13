import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ConfigurationService } from '../../shared/configuration.service';
import { errorMessage, errorValidationResults } from '../../shared/error-message';
import { CertificateModel, WebPkiService } from '../../shared/web-pki.service';

/** Response of POST /api/authentication-rest-pki-core/start. */
interface StartResponse {
  /** Carried back to the complete step. */
  state: string;
  /** The hash (Base64) to be signed. */
  toSignHash: string;
  digestAlgorithmOid: string;
}

/** Response of POST /api/authentication-rest-pki-core/complete. */
interface CompleteResponse {
  certificate: AuthenticatedCertificate;
  validationResults: string | null;
}

interface AuthenticatedCertificate {
  subjectName: string | null;
  emailAddress: string | null;
  issuerName: string | null;
  serialNumber: string | null;
  validityStart: string;
  validityEnd: string;
  thumbprintSha256: string | null;
  pkiBrazil: {
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
 * Certificate authentication with Rest PKI Core: Rest PKI Core issues a hash, Web PKI signs it with
 * the user's certificate (signHash), and Rest PKI Core validates the signature and the certificate.
 */
@Component({
  selector: 'app-authentication-rest-pki-core',
  imports: [FormsModule, RouterLink, DatePipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './authentication-rest-pki-core.html',
})
export class AuthenticationRestPkiCore implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly webPki = inject(WebPkiService);
  protected readonly configuration = inject(ConfigurationService);

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
      // 1. The server asks Rest PKI Core for a hash to be signed, and gets a state to carry along.
      const start = await firstValueFrom(this.http.post<StartResponse>('/api/authentication-rest-pki-core/start', {}));

      // 2. Web PKI signs the hash with the certificate's private key, which never leaves the user's
      //    computer.
      const signature = await this.webPki.signHash(thumbprint, start.toSignHash, start.digestAlgorithmOid);

      // 3. Send the state, the certificate (public) and the signature to the server, which has
      //    Rest PKI Core validate them. The certificate is not trusted until that validation succeeds.
      const certContent = await this.webPki.readCertificate(thumbprint);
      this.result.set(await firstValueFrom(this.http.post<CompleteResponse>('/api/authentication-rest-pki-core/complete', {
        state: start.state,
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
