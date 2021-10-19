import { CertificateModel } from "../certificate";
import { DigestAlgorithmAndValueModel } from "../digest-algorithm-and-value";
import { SignatureAlgorithmAndValueModel } from "../signature-algorithm-and-value";
import { SignaturePolicyIdentifierModel } from "../signature-policy-identifier";
import { ValidationResultsModel } from "../validation-results";

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
