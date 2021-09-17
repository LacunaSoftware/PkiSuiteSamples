import { ValidationResults } from "web-pki";

export interface StartCadesSignatureRequest {
  isCosign: boolean,
  userFile: string,
  certContent: string,
  certThumb: string,
}

export interface StartCadesSignatureResponse {
  success: boolean,
  validationResults: ValidationResults,
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
  validationResults: ValidationResults,
}
