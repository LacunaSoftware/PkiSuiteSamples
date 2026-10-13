# ASP.NET MVC sample (.NET Framework 4.8)

One ASP.NET MVC 5 web app with the .NET samples for **PKI SDK**, **Rest PKI**, **Rest PKI Core**,
**Web PKI** and **CloudHub**. Each controller in `PkiSuiteAspNetMvcSample/Controllers/` is one
sample; its views are in `Views/<Controller>/` and its page scripts in `Content/js/`.

## Samples in this project

Every row is an entry in the repository catalog ([samples.json](../../samples.json),
[SAMPLES.md](../../SAMPLES.md)). Open the URL once the app is running.

<!-- BEGIN GENERATED SAMPLES LIST (project: dotnet/mvc) -->
| Sample | Product | Entry file | Open |
|---|---|---|---|
| Sign a PDF with Rest PKI Core<br>`pades-signature-rest-pki-core` | Rest PKI Core | [PadesSignatureRestCoreController.cs](PkiSuiteAspNetMvcSample/Controllers/PadesSignatureRestCoreController.cs) | http://localhost:54123/Home/CheckRestPkiCoreApiKey?rc=ServerFiles&ctrl=PadesSignatureRestCore&op=signPdf |
| Sign a PDF with PKI SDK<br>`pades-signature-pki-sdk` | PKI SDK | [PadesSignatureSdkController.cs](PkiSuiteAspNetMvcSample/Controllers/PadesSignatureSdkController.cs) | http://localhost:54123/Home/CheckPkiLicense?rc=ServerFiles&ctrl=PadesSignatureSdk&op=signPdf |
| Sign a local PDF in the browser with Web PKI<br>`pades-signature-web-pki` | Web PKI | [PadesSignatureWebController.cs](PkiSuiteAspNetMvcSample/Controllers/PadesSignatureWebController.cs) | http://localhost:54123/PadesSignatureWeb |
| Sign a PDF with Rest PKI<br>`pades-signature-rest-pki` | Rest PKI | [PadesSignatureRestController.cs](PkiSuiteAspNetMvcSample/Controllers/PadesSignatureRestController.cs) | http://localhost:54123/Home/CheckRestPkiToken?rc=ServerFiles&ctrl=PadesSignatureRest&op=signPdf |
| Sign multiple PDFs with PKI SDK<br>`batch-pades-signature-pki-sdk` | PKI SDK | [BatchPadesSignatureSdkController.cs](PkiSuiteAspNetMvcSample/Controllers/BatchPadesSignatureSdkController.cs) | http://localhost:54123/Home/CheckPkiLicense?rc=BatchPadesSignatureSdk |
| Sign multiple PDFs with Rest PKI<br>`batch-pades-signature-rest-pki` | Rest PKI | [BatchPadesSignatureRestController.cs](PkiSuiteAspNetMvcSample/Controllers/BatchPadesSignatureRestController.cs) | http://localhost:54123/Home/CheckRestPkiToken?rc=BatchPadesSignatureRest |
| Sign a PDF with a server key using Rest PKI Core<br>`pades-signature-server-key-rest-pki-core` | Rest PKI Core | [PadesServerKeyRestCoreController.cs](PkiSuiteAspNetMvcSample/Controllers/PadesServerKeyRestCoreController.cs) | http://localhost:54123/Home/CheckRestPkiCoreApiKey?rc=Upload&ctrl=PadesServerKeyRestCore |
| Sign a PDF with a server key using PKI SDK<br>`pades-signature-server-key-pki-sdk` | PKI SDK | [PadesServerKeySdkController.cs](PkiSuiteAspNetMvcSample/Controllers/PadesServerKeySdkController.cs) | http://localhost:54123/Home/CheckPkiLicense?rc=Upload&ctrl=PadesServerKeySdk |
| Sign a PDF with a cloud certificate using CloudHub<br>`sign-with-cloud-certificate-cloudhub` | CloudHub | [PadesCloudHubSdkController.cs](PkiSuiteAspNetMvcSample/Controllers/PadesCloudHubSdkController.cs) | http://localhost:54123/Home/CheckPkiLicense?rc=ServerFiles&ctrl=PadesCloudHubSdk&op=signPdf |
| Sign a PDF with a cloud certificate (OAuth flow) using PKI SDK<br>`pades-signature-cloud-oauth-pki-sdk` | PKI SDK | [PadesCloudOauthSdkController.cs](PkiSuiteAspNetMvcSample/Controllers/PadesCloudOauthSdkController.cs) | http://localhost:54123/Home/CheckPkiLicense?rc=Upload&ctrl=PadesCloudOauthSdk |
| Sign a PDF with a cloud certificate (password flow) using PKI SDK<br>`pades-signature-cloud-password-pki-sdk` | PKI SDK | [PadesCloudPwdSdkController.cs](PkiSuiteAspNetMvcSample/Controllers/PadesCloudPwdSdkController.cs) | http://localhost:54123/Home/CheckPkiLicense?rc=Upload&ctrl=PadesCloudPwdSdk |
| Signature session with Rest PKI Core<br>`signature-session-rest-pki-core` | Rest PKI Core | [SignatureSessionRestCoreController.cs](PkiSuiteAspNetMvcSample/Controllers/SignatureSessionRestCoreController.cs) | http://localhost:54123/SignatureSessionRestCore |
| Signature session with predefined documents using Rest PKI Core<br>`signature-session-predefined-documents-rest-pki-core` | Rest PKI Core | [SignatureSessionPreDefRestCoreController.cs](PkiSuiteAspNetMvcSample/Controllers/SignatureSessionPreDefRestCoreController.cs) | http://localhost:54123/SignatureSessionPreDefRestCore |
| Validate files uploaded to a Rest PKI Core signature session<br>`signature-session-file-validation-rest-pki-core` | Rest PKI Core | [ValidateFileRestCoreController.cs](PkiSuiteAspNetMvcSample/Controllers/ValidateFileRestCoreController.cs) | http://localhost:54123/ValidateFileRestCore |
| Receive Rest PKI Core webhooks<br>`webhook-rest-pki-core` | Rest PKI Core | [WebhookRestCoreController.cs](PkiSuiteAspNetMvcSample/Controllers/WebhookRestCoreController.cs) | http://localhost:54123/WebhookRestCore |
| Timestamp a PDF with Rest PKI Core<br>`timestamp-pdf-rest-pki-core` | Rest PKI Core | [TimestampPdfRestCoreController.cs](PkiSuiteAspNetMvcSample/Controllers/TimestampPdfRestCoreController.cs) | http://localhost:54123/Home/CheckRestPkiCoreApiKey?rc=Upload&ctrl=TimestampPdfRestCore |
| Sign a file with CAdES using PKI SDK<br>`cades-signature-pki-sdk` | PKI SDK | [CadesSignatureSdkController.cs](PkiSuiteAspNetMvcSample/Controllers/CadesSignatureSdkController.cs) | http://localhost:54123/Home/CheckPkiLicense?rc=ServerFiles&ctrl=CadesSignatureSdk&op=signCms |
| Sign a local file with CAdES in the browser using Web PKI<br>`cades-signature-web-pki` | Web PKI | [CadesSignatureWebController.cs](PkiSuiteAspNetMvcSample/Controllers/CadesSignatureWebController.cs) | http://localhost:54123/CadesSignatureWeb |
| Sign a file with CAdES using Rest PKI<br>`cades-signature-rest-pki` | Rest PKI | [CadesSignatureRestController.cs](PkiSuiteAspNetMvcSample/Controllers/CadesSignatureRestController.cs) | http://localhost:54123/Home/CheckRestPkiToken?rc=ServerFiles&ctrl=CadesSignatureRest&op=signCms |
| Sign multiple files with CAdES using PKI SDK<br>`batch-cades-signature-pki-sdk` | PKI SDK | [BatchCadesSignatureSdkController.cs](PkiSuiteAspNetMvcSample/Controllers/BatchCadesSignatureSdkController.cs) | http://localhost:54123/Home/CheckPkiLicense?rc=BatchCadesSignatureSdk |
| Sign multiple files with CAdES using Rest PKI<br>`batch-cades-signature-rest-pki` | Rest PKI | [BatchCadesSignatureRestController.cs](PkiSuiteAspNetMvcSample/Controllers/BatchCadesSignatureRestController.cs) | http://localhost:54123/Home/CheckRestPkiToken?rc=BatchCadesSignatureRest |
| Sign a file with CAdES and a server key using PKI SDK<br>`cades-signature-server-key-pki-sdk` | PKI SDK | [CadesServerKeySdkController.cs](PkiSuiteAspNetMvcSample/Controllers/CadesServerKeySdkController.cs) | http://localhost:54123/Home/CheckPkiLicense?rc=Upload&ctrl=CadesServerKeySdk |
| Merge CMS/CAdES signatures using PKI SDK<br>`merge-cades-signatures-pki-sdk` | PKI SDK | [MergeCadesSdkController.cs](PkiSuiteAspNetMvcSample/Controllers/MergeCadesSdkController.cs) | http://localhost:54123/Home/CheckPkiLicense?rc=MergeServerFiles&ctrl=MergeCadesSdk |
| Sign an XML document using PKI SDK<br>`xml-signature-pki-sdk` | PKI SDK | [XmlSignatureSdkController.cs](PkiSuiteAspNetMvcSample/Controllers/XmlSignatureSdkController.cs) | http://localhost:54123/Home/CheckPkiLicense?rc=XmlSignatureSdk |
| Sign an XML document using Rest PKI<br>`xml-signature-rest-pki` | Rest PKI | [XmlSignatureRestController.cs](PkiSuiteAspNetMvcSample/Controllers/XmlSignatureRestController.cs) | http://localhost:54123/Home/CheckRestPkiToken?rc=XmlSignatureRest |
| Sign an XML document with a server key using PKI SDK<br>`xml-signature-server-key-pki-sdk` | PKI SDK | [XmlServerKeySdkController.cs](PkiSuiteAspNetMvcSample/Controllers/XmlServerKeySdkController.cs) | http://localhost:54123/Home/CheckPkiLicense?rc=XmlServerKeySdk |
| Sign one element of an XML document using Rest PKI<br>`xml-element-signature-rest-pki` | Rest PKI | [XmlContractSignatureRestController.cs](PkiSuiteAspNetMvcSample/Controllers/XmlContractSignatureRestController.cs) | http://localhost:54123/XmlContractSignatureRest |
| Sign a Brazilian NF-e using PKI SDK<br>`xml-nfe-signature-pki-sdk` | PKI SDK | [XmlNFeSignatureSdkController.cs](PkiSuiteAspNetMvcSample/Controllers/XmlNFeSignatureSdkController.cs) | http://localhost:54123/Home/CheckPkiLicense?rc=XmlNFeSignatureSdk |
| Sign a Brazilian NF-e using Rest PKI<br>`xml-nfe-signature-rest-pki` | Rest PKI | [XmlNFeSignatureRestController.cs](PkiSuiteAspNetMvcSample/Controllers/XmlNFeSignatureRestController.cs) | http://localhost:54123/Home/CheckRestPkiToken?rc=XmlNFeSignatureRest |
| Sign a COD XML using PKI SDK<br>`xml-cod-signature-pki-sdk` | PKI SDK | [XmlCodSignatureSdkController.cs](PkiSuiteAspNetMvcSample/Controllers/XmlCodSignatureSdkController.cs) | http://localhost:54123/Home/CheckPkiLicense?rc=XmlCodSignatureSdk |
| Sign a COD XML using Rest PKI<br>`xml-cod-signature-rest-pki` | Rest PKI | [XmlCodSignatureRestController.cs](PkiSuiteAspNetMvcSample/Controllers/XmlCodSignatureRestController.cs) | http://localhost:54123/Home/CheckRestPkiToken?rc=XmlCodSignatureRest |
| Validate a signed PDF using PKI SDK<br>`validate-pades-signature-pki-sdk` | PKI SDK | [OpenPadesSignatureSdkController.cs](PkiSuiteAspNetMvcSample/Controllers/OpenPadesSignatureSdkController.cs) | http://localhost:54123/Home/CheckPkiLicense?rc=Upload&ctrl=OpenPadesSignatureSdk |
| Validate a signed PDF using Rest PKI<br>`validate-pades-signature-rest-pki` | Rest PKI | [OpenPadesSignatureRestController.cs](PkiSuiteAspNetMvcSample/Controllers/OpenPadesSignatureRestController.cs) | http://localhost:54123/Home/CheckRestPkiToken?rc=Upload&ctrl=OpenPadesSignatureRest |
| Validate a CMS/CAdES signature using PKI SDK<br>`validate-cades-signature-pki-sdk` | PKI SDK | [OpenCadesSignatureSdkController.cs](PkiSuiteAspNetMvcSample/Controllers/OpenCadesSignatureSdkController.cs) | http://localhost:54123/Home/CheckPkiLicense?rc=Upload&ctrl=OpenCadesSignatureSdk |
| Validate a CMS/CAdES signature using Rest PKI<br>`validate-cades-signature-rest-pki` | Rest PKI | [OpenCadesSignatureRestController.cs](PkiSuiteAspNetMvcSample/Controllers/OpenCadesSignatureRestController.cs) | http://localhost:54123/Home/CheckRestPkiToken?rc=Upload&ctrl=OpenCadesSignatureRest |
| Validate a signed XML using PKI SDK<br>`validate-xml-signature-pki-sdk` | PKI SDK | [OpenXmlSignatureSdkController.cs](PkiSuiteAspNetMvcSample/Controllers/OpenXmlSignatureSdkController.cs) | http://localhost:54123/Home/CheckPkiLicense?rc=Upload&ctrl=OpenXmlSignatureSdk |
| Validate a signed XML using Rest PKI<br>`validate-xml-signature-rest-pki` | Rest PKI | [OpenXmlSignatureRestController.cs](PkiSuiteAspNetMvcSample/Controllers/OpenXmlSignatureRestController.cs) | http://localhost:54123/Home/CheckRestPkiToken?rc=Upload&ctrl=OpenXmlSignatureRest |
| Make a printer-friendly version of a signed PDF using PKI SDK<br>`printer-friendly-pdf-pki-sdk` | PKI SDK | [PrinterFriendlyPadesSdkController.cs](PkiSuiteAspNetMvcSample/Controllers/PrinterFriendlyPadesSdkController.cs) | http://localhost:54123/Home/CheckPkiLicense?rc=ServerFiles&ctrl=PrinterFriendlyPadesSdk&op=printerFriendlyPdf |
| Make a printer-friendly version of a signed PDF using Rest PKI<br>`printer-friendly-pdf-rest-pki` | Rest PKI | [PrinterFriendlyPadesRestController.cs](PkiSuiteAspNetMvcSample/Controllers/PrinterFriendlyPadesRestController.cs) | http://localhost:54123/Home/CheckRestPkiToken?rc=ServerFiles&ctrl=PrinterFriendlyPadesRest&op=printerFriendlyPdf |
| Make a printer-friendly version of a CMS/CAdES signature using PKI SDK<br>`printer-friendly-cades-pki-sdk` | PKI SDK | [PrinterFriendlyCadesSdkController.cs](PkiSuiteAspNetMvcSample/Controllers/PrinterFriendlyCadesSdkController.cs) | http://localhost:54123/Home/CheckPkiLicense?rc=ServerFiles&ctrl=PrinterFriendlyCadesSdk&op=printerFriendlyCades |
| Make a printer-friendly version of a CMS/CAdES signature using Rest PKI<br>`printer-friendly-cades-rest-pki` | Rest PKI | [PrinterFriendlyCadesRestController.cs](PkiSuiteAspNetMvcSample/Controllers/PrinterFriendlyCadesRestController.cs) | http://localhost:54123/Home/CheckRestPkiToken?rc=ServerFiles&ctrl=PrinterFriendlyCadesRest&op=printerFriendlyCades |
| Authenticate with a digital certificate using PKI SDK<br>`authentication-pki-sdk` | PKI SDK | [AuthenticationSdkController.cs](PkiSuiteAspNetMvcSample/Controllers/AuthenticationSdkController.cs) | http://localhost:54123/Home/CheckPkiLicense?rc=AuthenticationSdk |
| Authenticate with a digital certificate using Rest PKI<br>`authentication-rest-pki` | Rest PKI | [AuthenticationRestController.cs](PkiSuiteAspNetMvcSample/Controllers/AuthenticationRestController.cs) | http://localhost:54123/Home/CheckRestPkiToken?rc=AuthenticationRest |
| Authenticate with a cloud certificate using CloudHub<br>`authentication-cloudhub` | CloudHub | [AuthenticationCloudHubSdkController.cs](PkiSuiteAspNetMvcSample/Controllers/AuthenticationCloudHubSdkController.cs) | http://localhost:54123/AuthenticationCloudHubSdk |
| List the user's certificates with Web PKI<br>`list-certificates-web-pki` | Web PKI | [ListCertJQueryController.cs](PkiSuiteAspNetMvcSample/Controllers/ListCertJQueryController.cs) | http://localhost:54123/ListCertJQuery |
| Read a certificate's details with Web PKI<br>`read-certificate-web-pki` | Web PKI | [ReadCertJQueryController.cs](PkiSuiteAspNetMvcSample/Controllers/ReadCertJQueryController.cs) | http://localhost:54123/ReadCertJQuery |
| Sign data with RSA in the browser using Web PKI<br>`rsa-signature-web-pki` | Web PKI | [RSAWebController.cs](PkiSuiteAspNetMvcSample/Controllers/RSAWebController.cs) | http://localhost:54123/RSAWeb |
| Sign a medical prescription (Receita Simples) using PKI SDK<br>`prescription-signature-pki-sdk` | PKI SDK | [ReceitaSimplesSdkController.cs](PkiSuiteAspNetMvcSample/Controllers/ReceitaSimplesSdkController.cs) | http://localhost:54123/ReceitaSimplesSdk |
<!-- END GENERATED SAMPLES LIST -->

## Run

1. Open `PkiSuiteAspNetMvcSample.sln` in Visual Studio (with the ASP.NET workload) and let it
   restore the NuGet packages (`packages.config`).
2. Press F5. The app runs on IIS Express at http://localhost:54123/.

## Configuration

- `PkiSuiteAspNetMvcSample/Web.config`, `<appSettings>`: Rest PKI token, Rest PKI Core key,
  CloudHub key, Web PKI license and PSC credentials. Every key is documented in
  [`Web.config.example`](PkiSuiteAspNetMvcSample/Web.config.example).
- `PkiSuiteAspNetMvcSample/LacunaPkiLicense.config`: the PKI SDK license, copied to `bin/` on build.
- The committed values are trial credentials rotated by `update-licenses.ps1`. Do not replace them
  in this repository.
- Debug builds trust Lacuna's [test certificates](https://docs.lacunasoftware.com/articles/pki-guide/test-certs)
  (`Util.GetSecurityContextId()`); release builds do not.

See also: [.NET samples README](../README.md), [AGENTS.md](../../AGENTS.md).
