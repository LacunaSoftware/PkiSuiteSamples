import { CertificateModel } from "../certificate";
import { ValidationResultsModel } from "../validation-results";

export interface StartSignatureRequest {
  certContent: string,
  userFile?: string, // user's file to be signed (optional)
}

export interface StartSignatureResponse {
  success: boolean,
  validationResults: ValidationResultsModel,
  toSignHash: string,
  transferDataId: string,
  digestAlgorithm: string,
}

export interface CompleteSignatureRequest {
  signature: string,
  transferDataId: string,
}

export interface CompleteSignatureResponse {
  success: boolean,
  validationResults: ValidationResultsModel,
  signedFileId: string,
}

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

export interface StartAuthenticationResponse {
  nonce: string,
  digestAlgorithm: string,
}

export interface CompleteAuthenticationRequest {
  nonce: string,
  certificate: string,
  signature: string,
}

export interface CompleteAuthenticationResponse {
  isValid: boolean,
  validationResults: ValidationResultsModel,
  certificate: CertificateModel,
}
