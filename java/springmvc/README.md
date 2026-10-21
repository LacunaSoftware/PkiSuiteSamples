# Spring Boot sample (Java)

One Spring Boot web app with the Java samples for **Rest PKI Core**, **Rest PKI**, **PKI Express**,
**Amplia**, **CloudHub**, **Signer** and **Web PKI**. Each controller in
`src/main/java/com/lacunasoftware/pkisuite/controller/` is one sample (batch samples also have a
REST controller in `api/`); templates are in `src/main/resources/templates/`, and page scripts in
`src/main/resources/static/js/`.

## Samples in this project

Every row is an entry in the repository catalog ([samples.json](../../samples.json),
[SAMPLES.md](../../SAMPLES.md)). Open the URL once the app is running.

<!-- BEGIN GENERATED SAMPLES LIST (project: java/springmvc) -->
| Sample | Product | Entry file | Open |
|---|---|---|---|
| Sign a PDF with Rest PKI Core<br>`pades-signature-rest-pki-core` | Rest PKI Core | [PadesSignatureCoreController.java](src/main/java/com/lacunasoftware/pkisuite/controller/PadesSignatureCoreController.java) | http://localhost:60695/check-rest-pki-core-api-key?rc=server-files&fwd=pades-signature&op=signPdf |
| Sign a PDF with PKI Express<br>`pades-signature-pki-express` | PKI Express | [PadesSignatureExpressController.java](src/main/java/com/lacunasoftware/pkisuite/controller/PadesSignatureExpressController.java) | http://localhost:60695/check-express?rc=server-files&fwd=pades-signature&op=signPdf |
| Sign a PDF with Rest PKI<br>`pades-signature-rest-pki` | Rest PKI | [PadesSignatureRestController.java](src/main/java/com/lacunasoftware/pkisuite/controller/PadesSignatureRestController.java) | http://localhost:60695/check-rest-token?rc=server-files&fwd=pades-signature&op=signPdf |
| Sign multiple PDFs with PKI Express<br>`batch-pades-signature-pki-express` | PKI Express | [BatchPadesSignatureExpressController.java](src/main/java/com/lacunasoftware/pkisuite/controller/BatchPadesSignatureExpressController.java) | http://localhost:60695/check-express?rc=batch-signature |
| Sign multiple PDFs with Rest PKI<br>`batch-pades-signature-rest-pki` | Rest PKI | [BatchPadesSignatureRestController.java](src/main/java/com/lacunasoftware/pkisuite/controller/BatchPadesSignatureRestController.java) | http://localhost:60695/check-rest-token?rc=batch-signature |
| Sign multiple Signer documents with Web PKI<br>`batch-pades-signature-signer` | Signer | [BatchSignerSignatureController.java](src/main/java/com/lacunasoftware/pkisuite/controller/BatchSignerSignatureController.java) | http://localhost:60695/batch-signer-signature |
| Sign a PDF with a server key using PKI Express<br>`pades-signature-server-key-pki-express` | PKI Express | [PadesServerKeyExpressController.java](src/main/java/com/lacunasoftware/pkisuite/controller/PadesServerKeyExpressController.java) | http://localhost:60695/check-express?rc=upload&fwd=pades-server-key |
| Sign a PDF with a cloud certificate using CloudHub<br>`sign-with-cloud-certificate-cloudhub` | CloudHub | [PadesSignatureCloudhubRestController.java](src/main/java/com/lacunasoftware/pkisuite/controller/PadesSignatureCloudhubRestController.java) | http://localhost:60695/check-rest-token?rc=server-files&fwd=pades-signature-cloudhub&op=signPdf |
| Sign a PDF with a cloud certificate (OAuth flow) using PKI Express<br>`pades-signature-cloud-oauth-pki-express` | PKI Express | [PadesCloudOauthExpressController.java](src/main/java/com/lacunasoftware/pkisuite/controller/PadesCloudOauthExpressController.java) | http://localhost:60695/check-express?rc=upload&fwd=pades-cloud-oauth |
| Sign a PDF with a cloud certificate (password flow) using PKI Express<br>`pades-signature-cloud-password-pki-express` | PKI Express | [PadesCloudPwdExpressController.java](src/main/java/com/lacunasoftware/pkisuite/controller/PadesCloudPwdExpressController.java) | http://localhost:60695/check-express?rc=upload&fwd=pades-cloud-pwd |
| Signature session with Rest PKI Core<br>`signature-session-rest-pki-core` | Rest PKI Core | [SignatureSessionRestCoreController.java](src/main/java/com/lacunasoftware/pkisuite/controller/SignatureSessionRestCoreController.java) | http://localhost:60695/signature-session-rest-core |
| Signature session with predefined documents using Rest PKI Core<br>`signature-session-predefined-documents-rest-pki-core` | Rest PKI Core | [SignatureSessionPreDefRestCoreController.java](src/main/java/com/lacunasoftware/pkisuite/controller/SignatureSessionPreDefRestCoreController.java) | http://localhost:60695/signature-session-predef-rest-core |
| Validate files uploaded to a Rest PKI Core signature session<br>`signature-session-file-validation-rest-pki-core` | Rest PKI Core | [ValidateFileRestCoreController.java](src/main/java/com/lacunasoftware/pkisuite/controller/ValidateFileRestCoreController.java) | http://localhost:60695/validate-file-rest-core |
| Receive Rest PKI Core webhooks<br>`webhook-rest-pki-core` | Rest PKI Core | [WebhookRestCoreController.java](src/main/java/com/lacunasoftware/pkisuite/controller/WebhookRestCoreController.java) | http://localhost:60695/webhook-rest-core |
| Sign a file with CAdES using PKI Express<br>`cades-signature-pki-express` | PKI Express | [CadesSignatureExpressController.java](src/main/java/com/lacunasoftware/pkisuite/controller/CadesSignatureExpressController.java) | http://localhost:60695/check-express?rc=server-files&fwd=cades-signature&op=signCms |
| Sign a file with CAdES using Rest PKI<br>`cades-signature-rest-pki` | Rest PKI | [CadesSignatureRestController.java](src/main/java/com/lacunasoftware/pkisuite/controller/CadesSignatureRestController.java) | http://localhost:60695/check-rest-token?rc=server-files&fwd=cades-signature&op=signCms |
| Sign multiple files with CAdES using PKI Express<br>`batch-cades-signature-pki-express` | PKI Express | [BatchCadesSignatureExpressControler.java](src/main/java/com/lacunasoftware/pkisuite/controller/BatchCadesSignatureExpressControler.java) | http://localhost:60695/batch-cades-signature-express |
| Sign multiple files with CAdES using Rest PKI<br>`batch-cades-signature-rest-pki` | Rest PKI | [BatchCadesSignatureRestControler.java](src/main/java/com/lacunasoftware/pkisuite/controller/BatchCadesSignatureRestControler.java) | http://localhost:60695/batch-cades-signature-rest |
| Sign a file with CAdES and a cloud certificate (OAuth flow) using PKI Express<br>`cades-signature-cloud-oauth-pki-express` | PKI Express | [CadesCloudOauthExpressController.java](src/main/java/com/lacunasoftware/pkisuite/controller/CadesCloudOauthExpressController.java) | http://localhost:60695/check-express?rc=upload&fwd=cades-cloud-oauth |
| Merge CMS/CAdES signatures using PKI Express<br>`merge-cades-signatures-pki-express` | PKI Express | [MergeCadesExpressController.java](src/main/java/com/lacunasoftware/pkisuite/controller/MergeCadesExpressController.java) | http://localhost:60695/check-express?rc=merge-server-files&fwd=merge-cades |
| Sign an XML document using Rest PKI<br>`xml-signature-rest-pki` | Rest PKI | [XmlSignatureRestController.java](src/main/java/com/lacunasoftware/pkisuite/controller/XmlSignatureRestController.java) | http://localhost:60695/check-rest-token?rc=xml-signature |
| Sign a Brazilian NF-e using Rest PKI<br>`xml-nfe-signature-rest-pki` | Rest PKI | [XmlNFeSignatureRestController.java](src/main/java/com/lacunasoftware/pkisuite/controller/XmlNFeSignatureRestController.java) | http://localhost:60695/check-rest-token?rc=xml-nfe-signature |
| Sign a Brazilian digital diploma XML using Rest PKI<br>`xml-diploma-signature-rest-pki` | Rest PKI | [XmlDiplomaSignatureRestController.java](src/main/java/com/lacunasoftware/pkisuite/controller/XmlDiplomaSignatureRestController.java) | http://localhost:60695/xml-diploma-signature-rest |
| Validate a signed PDF using PKI Express<br>`validate-pades-signature-pki-express` | PKI Express | [OpenPadesExpressController.java](src/main/java/com/lacunasoftware/pkisuite/controller/OpenPadesExpressController.java) | http://localhost:60695/check-express?rc=upload&fwd=open-pades |
| Validate a signed PDF using Rest PKI<br>`validate-pades-signature-rest-pki` | Rest PKI | [OpenPadesRestController.java](src/main/java/com/lacunasoftware/pkisuite/controller/OpenPadesRestController.java) | http://localhost:60695/check-rest-token?rc=upload&fwd=open-pades |
| Validate a CMS/CAdES signature using PKI Express<br>`validate-cades-signature-pki-express` | PKI Express | [OpenCadesExpressController.java](src/main/java/com/lacunasoftware/pkisuite/controller/OpenCadesExpressController.java) | http://localhost:60695/check-express?rc=upload&fwd=open-cades |
| Validate a signed XML using Rest PKI<br>`validate-xml-signature-rest-pki` | Rest PKI | [OpenXmlRestController.java](src/main/java/com/lacunasoftware/pkisuite/controller/OpenXmlRestController.java) | http://localhost:60695/check-rest-token?rc=upload&fwd=open-xml |
| Make a printer-friendly version of a signed PDF using Rest PKI<br>`printer-friendly-pdf-rest-pki` | Rest PKI | [PrinterFriendlyPadesRestController.java](src/main/java/com/lacunasoftware/pkisuite/controller/PrinterFriendlyPadesRestController.java) | http://localhost:60695/check-rest-token?rc=server-files&fwd=printer-friendly-pades&op=printerFriendlyPdf |
| Authenticate with a digital certificate using Rest PKI Core<br>`authentication-rest-pki-core` | Rest PKI Core | [AuthenticationRestPkiCoreController.java](src/main/java/com/lacunasoftware/pkisuite/controller/AuthenticationRestPkiCoreController.java) | http://localhost:60695/authentication-restpki-core |
| Authenticate with a digital certificate using PKI Express<br>`authentication-pki-express` | PKI Express | [AuthenticationExpressController.java](src/main/java/com/lacunasoftware/pkisuite/controller/AuthenticationExpressController.java) | http://localhost:60695/check-express?rc=authentication |
| Authenticate with a digital certificate using Rest PKI<br>`authentication-rest-pki` | Rest PKI | [AuthenticationRestController.java](src/main/java/com/lacunasoftware/pkisuite/controller/AuthenticationRestController.java) | http://localhost:60695/check-rest-token?rc=authentication |
| Authenticate with a cloud certificate (OAuth flow) using PKI Express<br>`authentication-cloud-oauth-pki-express` | PKI Express | [AuthenticationCloudExpressController.java](src/main/java/com/lacunasoftware/pkisuite/controller/AuthenticationCloudExpressController.java) | http://localhost:60695/authentication-cloud-express |
| List the user's certificates with Web PKI<br>`list-certificates-web-pki` | Web PKI | [ListCertJQueryController.java](src/main/java/com/lacunasoftware/pkisuite/controller/ListCertJQueryController.java) | http://localhost:60695/list-cert-jquery |
| Read a certificate's details with Web PKI<br>`read-certificate-web-pki` | Web PKI | [ReadCertJQueryController.java](src/main/java/com/lacunasoftware/pkisuite/controller/ReadCertJQueryController.java) | http://localhost:60695/read-cert-jquery |
| Sign data with RSA in the browser using Web PKI<br>`rsa-signature-web-pki` | Web PKI | [RSAWebController.java](src/main/java/com/lacunasoftware/pkisuite/controller/RSAWebController.java) | http://localhost:60695/rsa-web |
| Issue a certificate with the key on the user's machine using Amplia<br>`issue-certificate-user-key-amplia` | Amplia | [IssueCertUserAmpliaController.java](src/main/java/com/lacunasoftware/pkisuite/controller/IssueCertUserAmpliaController.java) | http://localhost:60695/check-amplia-api-key?rc=issue-cert-user |
| Issue a certificate with the key on the server using Amplia<br>`issue-certificate-server-key-amplia` | Amplia | [IssueCertServerAmpliaController.java](src/main/java/com/lacunasoftware/pkisuite/controller/IssueCertServerAmpliaController.java) | http://localhost:60695/check-amplia-api-key?rc=issue-cert-server |
| Sign a medical prescription (Receita Simples) using PKI Express<br>`prescription-signature-pki-express` | PKI Express | [ReceitaSimplesExpressController.java](src/main/java/com/lacunasoftware/pkisuite/controller/ReceitaSimplesExpressController.java) | http://localhost:60695/receita-simples-express |
| Sign a medical prescription (Receita Simples) using Rest PKI<br>`prescription-signature-rest-pki` | Rest PKI | [ReceitaSimplesRestController.java](src/main/java/com/lacunasoftware/pkisuite/controller/ReceitaSimplesRestController.java) | http://localhost:60695/receita-simples-rest |
<!-- END GENERATED SAMPLES LIST -->

## Run

Requires JDK 21 or later. The project uses Spring Boot 4.0 and includes a Gradle 8.14 wrapper:

```bash
./gradlew bootRun
```

On Windows, use `gradlew.bat bootRun` or double-click `Run-Sample.bat`. Maven (3.6.3 or later)
works too, with the same dependencies in `pom.xml`:

```bash
mvn spring-boot:run
```

Then open http://localhost:60695/. The PKI Express samples also need PKI Express installed and
activated (`sudo pkie activate LacunaPkiLicense.config`).

## Configuration

- `src/main/resources/application.yml`: Rest PKI, Rest PKI Core, Amplia, CloudHub, PKI Express,
  proxy and Web PKI settings. `application-dev.yml` overrides it while the `dev` profile is active.
  Every key is documented in
  [`application.yml.example`](src/main/resources/application.yml.example).
- The Signer sample also needs `signer.apiKey` and `signer.endpoint`, which are not in the
  committed `application.yml`.
- The committed values are trial credentials rotated by `update-licenses.ps1`. Do not replace them
  in this repository.

See also: [Java samples README](../README.md), [AGENTS.md](../../AGENTS.md).
