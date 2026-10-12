import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { DocumentPicker } from '../../shared/document-picker/document-picker';
import { errorMessage } from '../../shared/error-message';
import { FilesService } from '../../shared/files.service';

/** The response of POST /api/validate-pades-signature-pki-sdk/open (see Models/ValidatePadesSignaturePkiSdk). */
interface PadesSignatureModel {
  signers: SignerModel[];
}

interface SignerModel {
  certificate: CertificateModel | null;
  signingTime: string | null;
  certifiedDateReference: string | null;
  messageDigest: { algorithm: string; hexValue: string } | null;
  signaturePolicy: { oid: string } | null;
  timestamps: { genTime: string; serialNumber: string }[];
  validationResults: ValidationResultsModel;
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
  passedChecks: ValidationItemModel[];
  warnings: ValidationItemModel[];
  errors: ValidationItemModel[];
}

interface ValidationItemModel {
  type: string;
  message: string;
  detail: string | null;
  innerValidationResults: ValidationResultsModel | null;
}

/**
 * Opens a signed PDF on the server and shows each signature with its validation results, as
 * validated by PKI SDK. Nobody signs anything here, so this page does not use Web PKI.
 *
 * The PDF is a sample document, an upload, or the file id passed as ?fileId=... (for instance by a
 * signature sample's "validate the signed file" link).
 */
@Component({
  selector: 'app-validate-pades-signature-pki-sdk',
  imports: [DatePipe, NgTemplateOutlet, RouterLink, DocumentPicker],
  templateUrl: './validate-pades-signature-pki-sdk.html',
})
export class ValidatePadesSignaturePkiSdk implements OnInit {
  private readonly http = inject(HttpClient);
  protected readonly files = inject(FilesService);

  /** Bound from the ?fileId=... query parameter. */
  readonly fileId = input<string>();

  protected readonly openedFileId = signal<string | null>(null);
  protected readonly signature = signal<PadesSignatureModel | null>(null);
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
      // The server opens the PDF and validates every signature in it.
      this.signature.set(
        await firstValueFrom(this.http.post<PadesSignatureModel>('/api/validate-pades-signature-pki-sdk/open', { fileId })),
      );
    } catch (error) {
      this.error.set(errorMessage(error));
    } finally {
      this.busy.set(false);
    }
  }

  protected isValid(signer: SignerModel): boolean {
    return signer.validationResults.errors.length === 0;
  }
}
