import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DocumentPicker } from '../../shared/document-picker/document-picker';
import { ConfigurationService } from '../../shared/configuration.service';
import { errorMessage } from '../../shared/error-message';
import { FilesService } from '../../shared/files.service';

/**
 * The response of POST /api/validate-pades-signature-rest-pki-core/open: the signers as Rest PKI
 * Core's signature inspection returns them (see ValidatePadesSignatureRestPkiCoreController.cs).
 * Fields Rest PKI Core leaves out arrive as null.
 */
interface OpenResponse {
  signers: SignerModel[];
}

interface SignerModel {
  certificate: CertificateModel | null;
  signingTime: string | null;
  certifiedDateReference: string | null;
  messageDigest: { algorithm: string; hexValue: string } | null;
  signaturePolicy: { oid: string } | null;
  timestamps: { genTime: string; serialNumber: string | null }[] | null;
  validationResults: ValidationResultsModel | null;
}

interface CertificateModel {
  subjectCommonName: string | null;
  subjectDisplayName: string | null;
  emailAddress: string | null;
  issuerDisplayName: string | null;
  validityStart: string;
  validityEnd: string;
  pkiBrazil: PkiBrazilCertificateModel | null;
}

/** Fields of ICP-Brasil certificates. Most are null on any given certificate. */
interface PkiBrazilCertificateModel {
  certificateType: string | null;
  cpf: string | null;
  cnpj: string | null;
  responsavel: string | null;
  companyName: string | null;
  oabNumero: string | null;
  oabUF: string | null;
  rgNumero: string | null;
  rgEmissor: string | null;
  rgEmissorUF: string | null;
}

interface ValidationResultsModel {
  passedChecks: ValidationItemModel[] | null;
  warnings: ValidationItemModel[] | null;
  errors: ValidationItemModel[] | null;
}

interface ValidationItemModel {
  type: string;
  message: string;
  detail: string | null;
  innerValidationResults: ValidationResultsModel | null;
}

/**
 * Opens a signed PDF on the server and shows each signature with its validation results, as
 * validated by Rest PKI Core. Nobody signs anything here, so this page does not use Web PKI.
 *
 * The PDF is a sample document, an upload, or the file id passed as ?fileId=... (for instance by a
 * signature sample's "validate the signed file" link).
 */
@Component({
  selector: 'app-validate-pades-signature-rest-pki-core',
  imports: [DatePipe, NgTemplateOutlet, RouterLink, DocumentPicker],
  templateUrl: './validate-pades-signature-rest-pki-core.html',
})
export class ValidatePadesSignatureRestPkiCore implements OnInit {
  private readonly http = inject(HttpClient);
  protected readonly files = inject(FilesService);
  protected readonly configuration = inject(ConfigurationService);

  /** Bound from the ?fileId=... query parameter. */
  readonly fileId = input<string>();

  protected readonly openedFileId = signal<string | null>(null);
  protected readonly signature = signal<OpenResponse | null>(null);
  protected readonly busy = signal(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const fileId = this.fileId();
    if (fileId) {
      void this.open(fileId);
    }
  }

  protected async open(fileId: string): Promise<void> {
    this.openedFileId.set(fileId);
    this.signature.set(null);
    this.error.set(null);
    this.busy.set(true);
    try {
      // The server sends the PDF to Rest PKI Core, which validates every signature in it.
      this.signature.set(
        await firstValueFrom(this.http.post<OpenResponse>('/api/validate-pades-signature-rest-pki-core/open', { fileId })),
      );
    } catch (error) {
      this.error.set(errorMessage(error));
    } finally {
      this.busy.set(false);
    }
  }

  protected isValid(signer: SignerModel): boolean {
    return (signer.validationResults?.errors ?? []).length === 0;
  }
}
