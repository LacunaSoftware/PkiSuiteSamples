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

export interface StartXmlSignatureRequest {
  certContent: string
}

export interface StartXmlSignatureResponse {
  toSignHash: string,
  transferDataId: string,
  digestAlgorithm: string,
  success: boolean,
  validationResults: ValidationResultsModel,
}

export interface CompleteXmlSignatureRequest {
  transferDataFileId: string,
  signature: string
}

export interface CompleteXmlSignatureResponse {
  signedFileId: string,
  success: boolean,
  validationResults: ValidationResultsModel,
}
