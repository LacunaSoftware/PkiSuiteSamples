import { ValidationResults } from "web-pki";


export interface StartXmlNFeSignatureRequest {
  certContent: string,
}

export interface StartXmlNFeSignatureResponse {
  success: boolean,
  validationResults: ValidationResults,
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
  validationResults: ValidationResults,
  signedFileId: string,
}
