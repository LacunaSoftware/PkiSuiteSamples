/**
 * The samples listed on the home page, one row per task. Each slug is also the sample's route
 * (see app.routes.ts) and its id in the repository catalog (samples.json).
 */
export interface SampleTask {
  task: string;
  description: string;
  /** Null when this project has no PKI SDK sample of the task. */
  pkiSdk: string | null;
  /** Null when Rest PKI Core cannot do the task. */
  restPkiCore: string | null;
}

export const sampleTasks: SampleTask[] = [
  {
    task: 'PAdES signature',
    description: 'Sign a PDF.',
    pkiSdk: 'pades-signature-pki-sdk',
    restPkiCore: 'pades-signature-rest-pki-core',
  },
  {
    task: 'CAdES signature',
    description: 'Sign any file, producing a CMS (.p7s) signature.',
    pkiSdk: 'cades-signature-pki-sdk',
    restPkiCore: 'cades-signature-rest-pki-core',
  },
  {
    task: 'XML signature',
    description: 'Sign an XML document.',
    pkiSdk: 'xml-signature-pki-sdk',
    restPkiCore: 'xml-signature-rest-pki-core',
  },
  {
    task: 'NF-e XML signature',
    description: 'Sign a Brazilian electronic invoice (NF-e). Rest PKI Core has no options for NF-e signatures.',
    pkiSdk: 'xml-nfe-signature-pki-sdk',
    restPkiCore: null,
  },
  {
    task: 'PAdES validation',
    description: 'Open a signed PDF and validate its signatures.',
    pkiSdk: 'validate-pades-signature-pki-sdk',
    restPkiCore: 'validate-pades-signature-rest-pki-core',
  },
  {
    task: 'Authentication',
    description: 'Authenticate the user with a digital certificate.',
    pkiSdk: 'authentication-pki-sdk',
    restPkiCore: 'authentication-rest-pki-core',
  },
  {
    task: 'Timestamp a PDF',
    description: 'Add a document timestamp to a PDF, without signing it.',
    pkiSdk: null,
    restPkiCore: 'timestamp-pdf-rest-pki-core',
  },
];
