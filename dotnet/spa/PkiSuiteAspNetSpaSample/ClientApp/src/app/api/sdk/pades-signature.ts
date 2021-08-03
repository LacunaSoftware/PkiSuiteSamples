import { ValidationResults } from "web-pki";

export interface StartPadesSignatureRequest {
  userFile: string,
  certContent: string
}

export interface StartPadesSignatureResponse {
  toSignHash: string,
  transferDataId: string,
  digestAlgorithm: string,
  success: boolean,
  validationResults: ValidationResults,
}

export interface CompletePadesSignatureRequest {
  transferDataFileId: string,
  signature: string
}

export interface CompletePadesSignatureResponse {
  signedFileId: string,
  success: boolean,
  validationResults: ValidationResults,
}
