import { CertificateModel } from "../certificate";
import { DigestAlgorithmAndValueModel } from "../digest-algorithm-and-value";
import { SignatureAlgorithmAndValueModel } from "../signature-algorithm-and-value";
import { SignaturePolicyIdentifierModel } from "../signature-policy-identifier";
import { ValidationResultsModel } from "../validation-results";
import { CadesTimestampModel } from "./cades-signature";

export interface StartPadesSignatureRequest {
  userFile: string,
  certContent: string
}

export interface StartPadesSignatureResponse {
  toSignHash: string,
  transferDataId: string,
  digestAlgorithm: string,
  success: boolean,
  validationResults: ValidationResultsModel,
}

export interface CompletePadesSignatureRequest {
  transferDataFileId: string,
  signature: string
}

export interface CompletePadesSignatureResponse {
  signedFileId: string,
  success: boolean,
  validationResults: ValidationResultsModel,
}

export interface OpenPadesSignatureResponse {
  signers: PadesSignerModel[],
}

export interface PadesSignerModel {
  messageDigest: DigestAlgorithmAndValueModel,
  signature: SignatureAlgorithmAndValueModel,
  signaturePolicy: SignaturePolicyIdentifierModel,
  certificate: CertificateModel,
  signingTime: string,
  certifiedDateReference: string,
  timestamps: CadesTimestampModel[],
  validationResults: ValidationResultsModel,
}
