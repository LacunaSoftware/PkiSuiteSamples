import { Injectable, inject } from '@angular/core';
import LacunaWebPKI, { CertificateModel, ExceptionModel, Promise as WebPkiPromise } from 'web-pki';
import { ConfigurationService } from './configuration.service';

export type { CertificateModel } from 'web-pki';

/** A failed Web PKI operation. Its message is Web PKI's user-friendly message. */
export class WebPkiError extends Error {
  constructor(readonly exception: ExceptionModel) {
    super(exception.userMessage || exception.message);
    this.name = 'WebPkiError';
  }
}

/**
 * Web PKI, the browser component that lists the user's certificates and signs with their private
 * key, which never leaves the user's computer. This service wraps the `web-pki` npm package so the
 * samples can `await` its operations.
 *
 * Every method first waits for `init()`. If Web PKI is not installed, the user is sent to its
 * installation page and comes back here once it is installed.
 */
@Injectable({ providedIn: 'root' })
export class WebPkiService {
  // The license is needed only when the app runs on a domain other than localhost. It comes from
  // the server's appsettings.json (WebPki:License), through GET /api/configuration.
  private readonly pki = new LacunaWebPKI(inject(ConfigurationService).webPkiLicense ?? undefined);
  private ready: Promise<void> | null = null;

  /** Initializes Web PKI. Resolves once the component is ready to be used. */
  init(): Promise<void> {
    this.ready ??= new Promise<void>((resolve, reject) => {
      this.pki.init({
        ready: () => resolve(),
        notInstalled: (_status, message) => {
          this.pki.redirectToInstallPage();
          reject(new Error(message));
        },
        defaultFail: (exception) => reject(new WebPkiError(exception)),
      });
    }).catch((error) => {
      // Let the next call try again.
      this.ready = null;
      throw error;
    });
    return this.ready;
  }

  /** Lists the certificates available on the user's computer (OS store and crypto devices). */
  async listCertificates(): Promise<CertificateModel[]> {
    await this.init();
    return this.wrap(this.pki.listCertificates());
  }

  /** Reads a certificate's content (Base64 DER), to send to the server. */
  async readCertificate(thumbprint: string): Promise<string> {
    await this.init();
    return this.wrap(this.pki.readCertificate({ thumbprint }));
  }

  /**
   * Signs a hash computed by the server with the certificate's private key. Returns the signature
   * value (Base64). This is the browser half of the start / signHash / complete flow.
   */
  async signHash(thumbprint: string, hash: string, digestAlgorithm: string): Promise<string> {
    await this.init();
    return this.wrap(this.pki.signHash({ thumbprint, hash, digestAlgorithm }));
  }

  /** Signs data (Base64) with the certificate's private key, such as an authentication nonce. */
  async signData(thumbprint: string, data: string, digestAlgorithm: string): Promise<string> {
    await this.init();
    return this.wrap(this.pki.signData({ thumbprint, data, digestAlgorithm }));
  }

  /** Turns a Web PKI promise (success / fail callbacks) into a standard Promise. */
  private wrap<T>(promise: WebPkiPromise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      promise.success((result) => resolve(result)).fail((exception) => reject(new WebPkiError(exception)));
    });
  }
}
