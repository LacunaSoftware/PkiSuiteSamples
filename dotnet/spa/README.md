# ASP.NET Core + Angular sample (.NET 10)

An ASP.NET Core 10 Web API with an Angular 21 front end, in the shape of Visual Studio's
"Angular and ASP.NET Core" template. It shows **PKI SDK** and **Rest PKI Core** signatures,
validation and authentication with **Web PKI**. Each sample is one API controller in
`PkiSuiteAspNetCoreAngularSample.Server/Controllers/` plus one Angular folder in
`pkisuiteaspnetcoreangularsample.client/src/app/samples/<sample id>/`.

Unlike the other projects, it has its own Angular home page instead of the shared home app, and
it uses Rest PKI Core only, never Rest PKI (v1). See
[ADR 0001](../../docs/adr/0001-aspnet-core-angular-project-deviations.md).

## Samples in this project

Every row is an entry in the repository catalog ([samples.json](../../samples.json),
[SAMPLES.md](../../SAMPLES.md)). Open the URL once the app is running.

<!-- BEGIN GENERATED SAMPLES LIST (project: dotnet/spa/PkiSuiteAspNetCoreAngularSample/PkiSuiteAspNetCoreAngularSample.Server) -->
| Sample | Product | Entry file | Open |
|---|---|---|---|
| Sign a PDF with Rest PKI Core<br>`pades-signature-rest-pki-core` | Rest PKI Core | [PadesSignatureRestPkiCoreController.cs](PkiSuiteAspNetCoreAngularSample/PkiSuiteAspNetCoreAngularSample.Server/Controllers/PadesSignatureRestPkiCoreController.cs) | http://localhost:4200/pades-signature-rest-pki-core |
| Sign a PDF with PKI SDK<br>`pades-signature-pki-sdk` | PKI SDK | [PadesSignaturePkiSdkController.cs](PkiSuiteAspNetCoreAngularSample/PkiSuiteAspNetCoreAngularSample.Server/Controllers/PadesSignaturePkiSdkController.cs) | http://localhost:4200/pades-signature-pki-sdk |
| Sign a file with CAdES using PKI SDK<br>`cades-signature-pki-sdk` | PKI SDK | [CadesSignaturePkiSdkController.cs](PkiSuiteAspNetCoreAngularSample/PkiSuiteAspNetCoreAngularSample.Server/Controllers/CadesSignaturePkiSdkController.cs) | http://localhost:4200/cades-signature-pki-sdk |
| Sign a file with CAdES using Rest PKI Core<br>`cades-signature-rest-pki-core` | Rest PKI Core | [CadesSignatureRestPkiCoreController.cs](PkiSuiteAspNetCoreAngularSample/PkiSuiteAspNetCoreAngularSample.Server/Controllers/CadesSignatureRestPkiCoreController.cs) | http://localhost:4200/cades-signature-rest-pki-core |
| Sign an XML document using PKI SDK<br>`xml-signature-pki-sdk` | PKI SDK | [XmlSignaturePkiSdkController.cs](PkiSuiteAspNetCoreAngularSample/PkiSuiteAspNetCoreAngularSample.Server/Controllers/XmlSignaturePkiSdkController.cs) | http://localhost:4200/xml-signature-pki-sdk |
| Sign an XML document using Rest PKI Core<br>`xml-signature-rest-pki-core` | Rest PKI Core | [XmlSignatureRestPkiCoreController.cs](PkiSuiteAspNetCoreAngularSample/PkiSuiteAspNetCoreAngularSample.Server/Controllers/XmlSignatureRestPkiCoreController.cs) | http://localhost:4200/xml-signature-rest-pki-core |
| Sign a Brazilian NF-e using PKI SDK<br>`xml-nfe-signature-pki-sdk` | PKI SDK | [XmlNfeSignaturePkiSdkController.cs](PkiSuiteAspNetCoreAngularSample/PkiSuiteAspNetCoreAngularSample.Server/Controllers/XmlNfeSignaturePkiSdkController.cs) | http://localhost:4200/xml-nfe-signature-pki-sdk |
| Validate a signed PDF using PKI SDK<br>`validate-pades-signature-pki-sdk` | PKI SDK | [ValidatePadesSignaturePkiSdkController.cs](PkiSuiteAspNetCoreAngularSample/PkiSuiteAspNetCoreAngularSample.Server/Controllers/ValidatePadesSignaturePkiSdkController.cs) | http://localhost:4200/validate-pades-signature-pki-sdk |
| Validate a signed PDF using Rest PKI Core<br>`validate-pades-signature-rest-pki-core` | Rest PKI Core | [ValidatePadesSignatureRestPkiCoreController.cs](PkiSuiteAspNetCoreAngularSample/PkiSuiteAspNetCoreAngularSample.Server/Controllers/ValidatePadesSignatureRestPkiCoreController.cs) | http://localhost:4200/validate-pades-signature-rest-pki-core |
| Authenticate with a digital certificate using Rest PKI Core<br>`authentication-rest-pki-core` | Rest PKI Core | [AuthenticationRestPkiCoreController.cs](PkiSuiteAspNetCoreAngularSample/PkiSuiteAspNetCoreAngularSample.Server/Controllers/AuthenticationRestPkiCoreController.cs) | http://localhost:4200/authentication-rest-pki-core |
| Authenticate with a digital certificate using PKI SDK<br>`authentication-pki-sdk` | PKI SDK | [AuthenticationPkiSdkController.cs](PkiSuiteAspNetCoreAngularSample/PkiSuiteAspNetCoreAngularSample.Server/Controllers/AuthenticationPkiSdkController.cs) | http://localhost:4200/authentication-pki-sdk |
<!-- END GENERATED SAMPLES LIST -->

## Run

Requires the .NET 10 SDK and Node.js 24.

```bash
cd PkiSuiteAspNetCoreAngularSample/pkisuiteaspnetcoreangularsample.client
npm ci
cd ../PkiSuiteAspNetCoreAngularSample.Server
dotnet run --launch-profile http
```

The server listens on http://localhost:5100 and, in Development, starts the Angular dev server
(`npm start`) on http://localhost:4200, which forwards `/api` calls to the server. Open
http://localhost:4200/. The `https` profile adds https://localhost:7100. You can also open
`PkiSuiteAspNetCoreAngularSample.sln` in Visual Studio and press F5.

`dotnet run` does not serve the Angular app on port 5100 itself: only `dotnet publish` builds it
into `wwwroot`. To run it as CI does:

```bash
dotnet publish PkiSuiteAspNetCoreAngularSample.Server -c Release -o out
cd out
ASPNETCORE_ENVIRONMENT=Development ASPNETCORE_URLS=http://localhost:5100 dotnet PkiSuiteAspNetCoreAngularSample.Server.dll
```

Run the published app from its own folder: the content root (`Content/`,
`LacunaPkiLicense.config`, `App_Data/`) is the working directory.

## Configuration

- `PkiSuiteAspNetCoreAngularSample.Server/appsettings.json`: the Rest PKI Core API key
  (`RestPkiCore:ApiKey`) and endpoint, and the Web PKI license. Every key is documented in
  [`appsettings.json.example`](PkiSuiteAspNetCoreAngularSample/PkiSuiteAspNetCoreAngularSample.Server/appsettings.json.example).
- `PkiSuiteAspNetCoreAngularSample.Server/LacunaPkiLicense.config`: the PKI SDK license, loaded
  by `Program.cs` from the content root.
- The committed values are trial credentials rotated by `update-licenses.ps1`. Do not replace them
  in this repository.
- Lacuna's [test certificates](https://docs.lacunasoftware.com/articles/pki-guide/test-certs) are
  trusted only when `PkiSuite:TrustLacunaTestRoot` is true, which `appsettings.Development.json`
  sets. A Release build run in Development still trusts them; production must not set the flag.

See also: [.NET samples README](../README.md), [AGENTS.md](../../AGENTS.md).
