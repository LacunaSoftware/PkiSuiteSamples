# Plain PHP sample

A plain-PHP web app (Composer, no framework) with the PHP samples for **Rest PKI Core**,
**Rest PKI**, **PKI Express**, **Amplia**, **CloudHub** and **Web PKI**. Each folder in `public/` is
one sample: `index.php` plus its step pages (`start.php`, `complete.php`, ...). Page scripts are in
`public/scripts/`, and shared helpers (`Util.php`, `StorageMock.php`, ...) in this folder.

## Samples in this project

Every row is an entry in the repository catalog ([samples.json](../../samples.json),
[SAMPLES.md](../../SAMPLES.md)). Open the URL once the app is running.

<!-- BEGIN GENERATED SAMPLES LIST (project: php/plain) -->
| Sample | Product | Entry file | Open |
|---|---|---|---|
| Sign a PDF with Rest PKI Core<br>`pades-signature-rest-pki-core` | Rest PKI Core | [index.php](public/pades-signature-rest-core/index.php) | http://localhost:8000/check-rest-core-key.php?rc=server-files&fwd=pades-signature&op=signPdf |
| Sign a PDF with PKI Express<br>`pades-signature-pki-express` | PKI Express | [index.php](public/pades-signature-express/index.php) | http://localhost:8000/check-express.php?rc=server-files&fwd=pades-signature&op=signPdf |
| Sign a PDF with Rest PKI<br>`pades-signature-rest-pki` | Rest PKI | [index.php](public/pades-signature-rest/index.php) | http://localhost:8000/check-rest-token.php?rc=server-files&fwd=pades-signature&op=signPdf |
| Sign multiple PDFs with PKI Express<br>`batch-pades-signature-pki-express` | PKI Express | [index.php](public/batch-pades-signature-express/index.php) | http://localhost:8000/check-express.php?rc=batch-pades-signature |
| Sign multiple PDFs with Rest PKI<br>`batch-pades-signature-rest-pki` | Rest PKI | [index.php](public/batch-pades-signature-rest/index.php) | http://localhost:8000/check-rest-token.php?rc=batch-pades-signature |
| Sign a PDF with a server key using PKI Express<br>`pades-signature-server-key-pki-express` | PKI Express | [index.php](public/pades-server-key-express/index.php) | http://localhost:8000/check-express.php?rc=upload.php&fwd=pades-server-key |
| Sign a PDF with a server key using Rest PKI<br>`pades-signature-server-key-rest-pki` | Rest PKI | [index.php](public/pades-server-key-rest/index.php) | http://localhost:8000/check-rest-token.php?rc=upload.php&fwd=pades-server-key |
| Sign a PDF with a cloud certificate using CloudHub<br>`sign-with-cloud-certificate-cloudhub` | CloudHub | [index.php](public/pades-signature-cloudhub-rest/index.php) | http://localhost:8000/check-rest-token.php?rc=server-files&fwd=pades-signature-cloudhub&op=signPdf |
| Sign a PDF with a cloud certificate (OAuth flow) using PKI Express<br>`pades-signature-cloud-oauth-pki-express` | PKI Express | [index.php](public/pades-cloud-oauth-express/index.php) | http://localhost:8000/check-express.php?rc=upload.php&fwd=pades-cloud-oauth |
| Sign a PDF with a cloud certificate (password flow) using PKI Express<br>`pades-signature-cloud-password-pki-express` | PKI Express | [index.php](public/pades-cloud-pwd-express/index.php) | http://localhost:8000/check-express.php?rc=upload.php&fwd=pades-cloud-pwd |
| Signature session with Rest PKI Core<br>`signature-session-rest-pki-core` | Rest PKI Core | [index.php](public/signature-session-rest-core/index.php) | http://localhost:8000/signature-session-rest-core/ |
| Validate files uploaded to a Rest PKI Core signature session<br>`signature-session-file-validation-rest-pki-core` | Rest PKI Core | [index.php](public/validate-file-rest-core/index.php) | http://localhost:8000/validate-file-rest-core/ |
| Receive Rest PKI Core webhooks<br>`webhook-rest-pki-core` | Rest PKI Core | [index.php](public/webhook-rest-core/index.php) | http://localhost:8000/webhook-rest-core/ |
| Timestamp a PDF with Rest PKI Core<br>`timestamp-pdf-rest-pki-core` | Rest PKI Core | [index.php](public/timestamp-pdf-rest-core/index.php) | http://localhost:8000/check-rest-core-key.php?rc=upload.php&fwd=timestamp-pdf |
| Sign a file with CAdES using PKI Express<br>`cades-signature-pki-express` | PKI Express | [index.php](public/cades-signature-express/index.php) | http://localhost:8000/check-express.php?rc=server-files&fwd=cades-signature&op=signCms |
| Sign a file with CAdES using Rest PKI<br>`cades-signature-rest-pki` | Rest PKI | [index.php](public/cades-signature-rest/index.php) | http://localhost:8000/check-rest-token.php?rc=server-files&fwd=cades-signature&op=signCms |
| Sign multiple files with CAdES using PKI Express<br>`batch-cades-signature-pki-express` | PKI Express | [index.php](public/batch-cades-signature-express/index.php) | http://localhost:8000/check-express.php?rc=batch-cades-signature |
| Sign a file with CAdES and a server key using PKI Express<br>`cades-signature-server-key-pki-express` | PKI Express | [index.php](public/cades-server-key-express/index.php) | http://localhost:8000/check-express.php?rc=upload.php&fwd=cades-server-key |
| Sign an XML document using Rest PKI<br>`xml-signature-rest-pki` | Rest PKI | [index.php](public/xml-signature-rest/index.php) | http://localhost:8000/check-rest-token.php?rc=xml-signature |
| Sign an XML document with a cloud certificate using CloudHub<br>`xml-signature-cloudhub` | CloudHub | [index.php](public/xml-signature-cloudhub-rest/index.php) | http://localhost:8000/check-rest-token.php?rc=xml-signature-cloudhub |
| Sign a Brazilian NF-e using PKI Express<br>`xml-nfe-signature-pki-express` | PKI Express | [index.php](public/xml-nfe-signature-express/index.php) | http://localhost:8000/check-express.php?rc=xml-nfe-signature |
| Sign a Brazilian NF-e using Rest PKI<br>`xml-nfe-signature-rest-pki` | Rest PKI | [index.php](public/xml-nfe-signature-rest/index.php) | http://localhost:8000/check-rest-token.php?rc=xml-nfe-signature |
| Sign a COD XML using PKI Express<br>`xml-cod-signature-pki-express` | PKI Express | [index.php](public/xml-cod-signature-express/index.php) | http://localhost:8000/check-express.php?rc=xml-cod-signature |
| Sign a COD XML using Rest PKI<br>`xml-cod-signature-rest-pki` | Rest PKI | [index.php](public/xml-cod-signature-rest/index.php) | http://localhost:8000/check-rest-token.php?rc=upload.php&fwd=xml-cod-signature |
| Sign a Brazilian digital diploma XML using Rest PKI<br>`xml-diploma-signature-rest-pki` | Rest PKI | [index.php](public/xml-diploma-signature-rest/index.php) | http://localhost:8000/check-rest-token.php?rc=xml-diploma-signature |
| Validate a signed PDF using PKI Express<br>`validate-pades-signature-pki-express` | PKI Express | [index.php](public/open-pades-express/index.php) | http://localhost:8000/check-express.php?rc=upload.php&fwd=open-pades |
| Validate a signed PDF using Rest PKI<br>`validate-pades-signature-rest-pki` | Rest PKI | [index.php](public/open-pades-rest/index.php) | http://localhost:8000/check-rest-token.php?rc=upload.php&fwd=open-pades |
| Validate a CMS/CAdES signature using PKI Express<br>`validate-cades-signature-pki-express` | PKI Express | [index.php](public/open-cades-express/index.php) | http://localhost:8000/check-express.php?rc=upload.php&fwd=open-cades |
| Validate a CMS/CAdES signature using Rest PKI<br>`validate-cades-signature-rest-pki` | Rest PKI | [index.php](public/open-cades-rest/index.php) | http://localhost:8000/check-rest-token.php?rc=upload.php&fwd=open-cades |
| Validate a signed XML using PKI Express<br>`validate-xml-signature-pki-express` | PKI Express | [index.php](public/open-xml-express/index.php) | http://localhost:8000/check-express.php?rc=upload.php&fwd=open-xml |
| Validate a signed XML using Rest PKI<br>`validate-xml-signature-rest-pki` | Rest PKI | [index.php](public/open-xml-rest/index.php) | http://localhost:8000/check-rest-token.php?rc=upload.php&fwd=open-xml |
| Make a printer-friendly version of a signed PDF using Rest PKI<br>`printer-friendly-pdf-rest-pki` | Rest PKI | [index.php](public/printer-friendly-pades-rest/index.php) | http://localhost:8000/check-rest-token.php?rc=server-files&fwd=printer-friendly-pades&op=printerFriendly |
| Authenticate with a digital certificate using PKI Express<br>`authentication-pki-express` | PKI Express | [index.php](public/authentication-express/index.php) | http://localhost:8000/check-express.php?rc=authentication |
| Authenticate with a digital certificate using Rest PKI<br>`authentication-rest-pki` | Rest PKI | [index.php](public/authentication-rest/index.php) | http://localhost:8000/check-rest-token.php?rc=authentication |
| Issue a certificate with the key on the user's machine using Amplia<br>`issue-certificate-user-key-amplia` | Amplia | [index.php](public/issue-cert-user-amplia/index.php) | http://localhost:8000/check-amplia-key.php?rc=issue-cert-user |
| Issue a certificate with the key on the server using Amplia<br>`issue-certificate-server-key-amplia` | Amplia | [index.php](public/issue-cert-server-amplia/index.php) | http://localhost:8000/check-amplia-key.php?rc=issue-cert-server |
| Issue an attribute certificate using Amplia<br>`issue-attribute-certificate-amplia` | Amplia | [index.php](public/issue-cert-attribute-amplia/index.php) | http://localhost:8000/issue-cert-attribute-amplia/ |
| Sign a medical prescription (Receita Simples) using PKI Express<br>`prescription-signature-pki-express` | PKI Express | [index.php](public/receita-simples-express/index.php) | http://localhost:8000/receita-simples-express/ |
| Sign a medical prescription (Receita Simples) using Rest PKI<br>`prescription-signature-rest-pki` | Rest PKI | [index.php](public/receita-simples-rest/index.php) | http://localhost:8000/receita-simples-rest/ |
<!-- END GENERATED SAMPLES LIST -->

## Run

```bash
composer install
composer start
```

`composer start` runs `php -S localhost:8000 -t public`. Then open http://localhost:8000/. The
PKI Express samples also need PKI Express installed and activated
(`sudo pkie activate LacunaPkiLicense.config`).

Recent Composer versions block packages that have security advisories, so `composer install`
fails with "these were not loaded, because they are affected by security advisories". The cause
is Guzzle 6: every release of `lacuna/amplia-client`, and `lacuna/cloudhub-client` 1.x, require
it, and there is no Amplia client for Guzzle 7 yet. To run the samples anyway, turn the check off
for this project before installing:

```bash
composer config policy.advisories.block false
composer install
```

This writes the setting into `composer.json`. Do not commit it, and do not copy it into your own
application.

## Configuration

- `config.php`: Rest PKI, Rest PKI Core (the `restPkiNg` section), Amplia, CloudHub, PKI Express
  and Web PKI settings. Every key is documented in [`config.php.example`](config.php.example).
- The committed values are trial credentials rotated by `update-licenses.ps1`. Do not replace them
  in this repository.

See also: [PHP samples README](../README.md), [AGENTS.md](../../AGENTS.md).
