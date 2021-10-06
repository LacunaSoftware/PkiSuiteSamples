import { CertificateModel } from "../certificate";
import { DigestAlgorithmAndValueModel } from "../digest-algorithm-and-value";
import { SignatureAlgorithmAndValueModel } from "../signature-algorithm-and-value";
import { SignaturePolicyIdentifierModel } from "../signature-policy-identifier";
import { ValidationResultsModel } from "../validation-results";

export interface StartSignatureRequest {
  userFile: string,
  isCmsCosign: boolean,
}

export interface StartSignatureResponse {
  token: string,
  userFile: string,
  success: boolean,
  validationResults: ValidationResultsModel,
}

export interface CompleteSignatureRequest {
  token: string,
}

export interface CompleteSignatureResponse {
  signedFileId: string,
  success: boolean,
  validationResults: ValidationResultsModel,
}

export interface XmlNFeStartSignatureResponse {
  token: string,
}

export interface XmlNFeCompleteSignatureResponse {
  signedFileId: string,
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
