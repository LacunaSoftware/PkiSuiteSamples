import { ValidationResults } from "web-pki";

export interface StartSignatureRequest {
  userFile: string,
  isCmsCosign: boolean,
}

export interface StartSignatureResponse {
  token: string,
  userFile: string,
  success: boolean,
  validationResults: ValidationResults,
}

export interface CompleteSignatureRequest {
  token: string,
}

export interface CompleteSignatureResponse {
  signedFileId: string,
  success: boolean,
  validationResults: ValidationResults,
}
