import { ValidationResults } from "web-pki";

export interface StartPadesSignatureRequest {
  userFile: string,
}

export interface StartPadesSignatureResponse {
  token: string,
  userFile: string,
  success: boolean,
  validationResults: ValidationResults,
}

export interface CompletePadesSignatureRequest {
  token: string,
}

export interface CompletePadesSignatureResponse {
  signedFileId: string,
  success: boolean,
  validationResults: ValidationResults,
}
