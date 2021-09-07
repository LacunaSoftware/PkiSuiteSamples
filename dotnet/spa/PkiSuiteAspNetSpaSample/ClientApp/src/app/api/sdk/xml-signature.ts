import { ValidationResultsModel } from "../validation-results";

export interface StartXmlNFeSignatureRequest {
  certContent: string,
}

export interface StartXmlNFeSignatureResponse {
  success: boolean,
  validationResults: ValidationResultsModel,
  toSignHash: string,
  transferDataFileId: string,
  digestAlgorithmOid: string,
}

export interface CompleteXmlNFeSignatureRequest {
  signature: string,
  transferDataFileId: string,
}

export interface CompleteXmlNFeSignatureResponse {
  success: boolean,
  validationResults: ValidationResultsModel,
  signedFileId: string,
}
