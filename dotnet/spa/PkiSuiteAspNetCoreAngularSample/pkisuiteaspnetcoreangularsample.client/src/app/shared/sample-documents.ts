/** The documents bundled with the server (the SampleDocument enum in StorageMock.cs). */
export type SampleDocument =
  | 'SamplePdf'
  | 'SamplePdfSignedOnce'
  | 'SamplePdfSignedTwice'
  | 'SampleXml'
  | 'SampleNFe';

export const sampleDocumentDescriptions: Record<SampleDocument, string> = {
  SamplePdf: 'A sample PDF document with no signatures',
  SamplePdfSignedOnce: 'A sample PDF signed once',
  SamplePdfSignedTwice: 'A sample PDF signed twice',
  SampleXml: 'A sample XML document',
  SampleNFe: 'A sample Brazilian electronic invoice (NF-e)',
};
