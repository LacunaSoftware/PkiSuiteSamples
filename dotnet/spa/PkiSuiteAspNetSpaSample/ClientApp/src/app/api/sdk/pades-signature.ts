import { CertificateModel } from "../certificate";
import { DigestAlgorithmAndValueModel } from "../digest-algorithm-and-value";
import { SignatureAlgorithmAndValueModel } from "../signature-algorithm-and-value";
import { SignaturePolicyIdentifierModel } from "../signature-policy-identifier";
import { ValidationResultsModel } from "../validation-results";
import { CadesTimestampModel } from "./cades-signature";

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
