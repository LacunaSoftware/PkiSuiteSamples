# ASP.NET Core + Angular sample

An ASP.NET Core 3.1 Web API with an Angular 8 front end (`PkiSuiteAspNetSpaSample/ClientApp/`).
It shows **PKI SDK** and **Rest PKI** signatures and authentication with **Web PKI** in a single-page
app: each API controller in `PkiSuiteAspNetSpaSample/Controllers/` pairs with an Angular component
in `ClientApp/src/app/components/`.

## Samples in this project

Every row is an entry in the repository catalog ([samples.json](../../samples.json),
[SAMPLES.md](../../SAMPLES.md)). Open the URL once the app is running.

<!-- BEGIN GENERATED SAMPLES LIST (project: dotnet/spa/PkiSuiteAspNetSpaSample) -->
| Sample | Product | Entry file | Open |
|---|---|---|---|
| Sign a PDF with PKI SDK<br>`pades-signature-pki-sdk` | PKI SDK | [PadesSignatureSdkController.cs](PkiSuiteAspNetSpaSample/Controllers/PadesSignatureSdkController.cs) | https://localhost:5001/RedirectToSPA?rc=server-files&fwd=pades-signature&op=SignPdf |
| Sign a PDF with Rest PKI<br>`pades-signature-rest-pki` | Rest PKI | [PadesSignatureRestController.cs](PkiSuiteAspNetSpaSample/Controllers/PadesSignatureRestController.cs) | https://localhost:5001/CheckRestPkiToken?rc=server-files&fwd=pades-signature&op=SignPdf |
| Sign a file with CAdES using PKI SDK<br>`cades-signature-pki-sdk` | PKI SDK | [CadesSignatureSdkController.cs](PkiSuiteAspNetSpaSample/Controllers/CadesSignatureSdkController.cs) | https://localhost:5001/RedirectToSPA?rc=server-files&fwd=cades-signature&op=SignCms |
| Sign a file with CAdES using Rest PKI<br>`cades-signature-rest-pki` | Rest PKI | [CadesSignatureRestController.cs](PkiSuiteAspNetSpaSample/Controllers/CadesSignatureRestController.cs) | https://localhost:5001/CheckRestPkiToken?rc=server-files&fwd=cades-signature&op=SignCms |
| Sign an XML document using PKI SDK<br>`xml-signature-pki-sdk` | PKI SDK | [XmlSignatureSdkController.cs](PkiSuiteAspNetSpaSample/Controllers/XmlSignatureSdkController.cs) | https://localhost:5001/RedirectToSPA?rc=xml-signature |
| Sign an XML document using Rest PKI<br>`xml-signature-rest-pki` | Rest PKI | [XmlSignatureRestController.cs](PkiSuiteAspNetSpaSample/Controllers/XmlSignatureRestController.cs) | https://localhost:5001/CheckRestPkiToken?rc=xml-signature |
| Sign a Brazilian NF-e using PKI SDK<br>`xml-nfe-signature-pki-sdk` | PKI SDK | [XmlNFeSignatureSdkController.cs](PkiSuiteAspNetSpaSample/Controllers/XmlNFeSignatureSdkController.cs) | https://localhost:5001/RedirectToSPA?rc=xml-nfe-signature |
| Sign a Brazilian NF-e using Rest PKI<br>`xml-nfe-signature-rest-pki` | Rest PKI | [XmlNFeSignatureRestController.cs](PkiSuiteAspNetSpaSample/Controllers/XmlNFeSignatureRestController.cs) | https://localhost:5001/CheckRestPkiToken?rc=xml-nfe-signature |
| Validate a signed PDF using PKI SDK<br>`validate-pades-signature-pki-sdk` | PKI SDK | [OpenPadesSdkController.cs](PkiSuiteAspNetSpaSample/Controllers/OpenPadesSdkController.cs) | https://localhost:5001/RedirectToSPA?rc=server-files&fwd=pades-signature&op=SignPdf |
| Validate a signed PDF using Rest PKI<br>`validate-pades-signature-rest-pki` | Rest PKI | [OpenPadesRestController.cs](PkiSuiteAspNetSpaSample/Controllers/OpenPadesRestController.cs) | https://localhost:5001/CheckRestPkiToken?rc=server-files&fwd=pades-signature&op=SignPdf |
| Authenticate with a digital certificate using PKI SDK<br>`authentication-pki-sdk` | PKI SDK | [AuthenticationSdkController.cs](PkiSuiteAspNetSpaSample/Controllers/AuthenticationSdkController.cs) | https://localhost:5001/RedirectToSPA?rc=authentication |
| Authenticate with a digital certificate using Rest PKI<br>`authentication-rest-pki` | Rest PKI | [AuthenticationRestController.cs](PkiSuiteAspNetSpaSample/Controllers/AuthenticationRestController.cs) | https://localhost:5001/CheckRestPkiToken?rc=authentication |
<!-- END GENERATED SAMPLES LIST -->

## Run

Requires the .NET Core 3.1 SDK and Node.js. The Angular CLI 8 build predates current Node.js
releases, so use an older Node.js LTS if `npm install` or `ng serve` fails.

```bash
cd PkiSuiteAspNetSpaSample
dotnet run
```

Open https://localhost:5001/. In Development, the app starts the Angular dev server itself. You
can also open `PkiSuiteAspNetSpaSample.sln` in Visual Studio and run the IIS Express profile.

## Configuration

- `PkiSuiteAspNetSpaSample/appsettings.json`: the Rest PKI token, plus optional Rest PKI Core and
  Web PKI sections. Every key is documented in
  [`appsettings.json.example`](PkiSuiteAspNetSpaSample/appsettings.json.example).
- `PkiSuiteAspNetSpaSample/LacunaPkiLicense.config`: the PKI SDK license, loaded by `Program.cs`
  from the working directory. Run the app from the project folder.
- The committed values are trial credentials rotated by `update-licenses.ps1`. Do not replace them
  in this repository.

See also: [.NET samples README](../README.md), [AGENTS.md](../../AGENTS.md).
