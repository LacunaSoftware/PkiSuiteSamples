import { CertificateModel } from "../certificate";
import { DigestAlgorithmAndValueModel } from "../digest-algorithm-and-value";
import { SignatureAlgorithmAndValueModel } from "../signature-algorithm-and-value";
import { SignaturePolicyIdentifierModel } from "../signature-policy-identifier";
import { ValidationResultsModel } from "../validation-results";

export interface StartCadesSignatureRequest {
  isCosign: boolean,
  userFile: string,
  certContent: string,
  certThumb: string,
}

export interface StartCadesSignatureResponse {
  success: boolean,
  validationResults: ValidationResultsModel,
  isCosign: boolean,
  userFile: string,
  certThumb: string,
  certContent: string,
  toSignHash: string,
  toSignBytes: string,
  digestAlgorithm: string,
}

export interface CompleteCadesSignatureRequest {
  isCosign: boolean,
  userFile: string,
  signature: string,
  toSignBytes: string,
  certContent: string,
}

export interface CompleteCadesSignatureResponse {
  signedFileId: string,
  success: boolean,
  validationResults: ValidationResultsModel,
}

export interface CadesTimestampModel {
  genTime: string,
  serialNumber: string,
  messageImprint: DigestAlgorithmAndValueModel,
  messageDigest: DigestAlgorithmAndValueModel,
  signature: SignatureAlgorithmAndValueModel,
  signaturePolicy: SignaturePolicyIdentifierModel,
  certificate: CertificateModel,
  signingTime: string,
  certifiedDateReference: string
  timestamps: CadesTimestampModel[],
  validationResults: ValidationResultsModel,
}
