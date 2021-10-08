import { DigestAlgorithmAndValueModel } from "./digest-algorithm-and-value";

export interface SignaturePolicyIdentifierModel {
  oid: string,
  hash: DigestAlgorithmAndValueModel,
  uri: string,
}
