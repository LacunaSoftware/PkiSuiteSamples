export interface CertificateModel {
  subjectName: NameModel,
  emailAddress: string,
  issuer: CertificateModel,
  issuerName: NameModel,
  issuerDisplayName: string,
  serialNumber: string,
  validityStart: string,
  validityEnd: string,
  pkiBrazil: PkiBrazilCertificateModel,
  pkiItaly: PkiItalyCertificateModel,
  binaryThumbprintSHA256: string,
  binaryThumbprintSHA1: string,
}

export interface NameModel {
  string: string,
  country: string,
  organization: string,
  organizationUnit: string,
  dnQualifier: string,
  stateName: string,
  commonName: string,
  serialNumber: string,
  locality: string,
  title: string,
  surname: string,
  givenName: string,
  initials: string,
  pseudonym: string,
  generationQualifier: string,
  emailAddress: string,
}

export interface PkiBrazilCertificateModel {
  certificateType: string,
  cpf: string,
  cnpj: string,
  responsavel: string,
  dateOfBirth: string,
  companyName: string,
  oabUF: string,
  oabNumero: string,
  rgEmissor: string,
  rgEmissorUF: string,
  rgNumero: string,
}

export interface PkiItalyCertificateModel {
  certificateType: string,
  codiceFiscale: string,
  idCarta: string,
}
