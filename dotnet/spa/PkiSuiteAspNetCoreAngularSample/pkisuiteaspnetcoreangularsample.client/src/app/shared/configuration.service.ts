import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

/** The response of GET /api/configuration (see ConfigurationController.cs). */
export interface ClientConfiguration {
  /** Web PKI license, or null. Web PKI needs no license on localhost. */
  webPkiLicense: string | null;
  /** Whether the server has a Rest PKI Core API key. */
  isRestPkiCoreConfigured: boolean;
}

/** Holds the server-side settings the browser needs. Loaded once, before the app starts. */
@Injectable({ providedIn: 'root' })
export class ConfigurationService {
  private readonly http = inject(HttpClient);
  private readonly value = signal<ClientConfiguration | null>(null);

  /** Set when GET /api/configuration failed, usually because the server is not running. */
  readonly loadError = signal<string | null>(null);

  get webPkiLicense(): string | null {
    return this.value()?.webPkiLicense ?? null;
  }

  get isRestPkiCoreConfigured(): boolean {
    return this.value()?.isRestPkiCoreConfigured ?? false;
  }

  /** Called by the app initializer (see app.config.ts). Never rejects, so the app still starts. */
  async load(): Promise<void> {
    try {
      this.value.set(await firstValueFrom(this.http.get<ClientConfiguration>('/api/configuration')));
    } catch (error) {
      console.error('Could not fetch the configuration', error);
      this.loadError.set('Could not reach the server (GET /api/configuration failed).');
    }
  }
}
