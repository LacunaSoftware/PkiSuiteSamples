# Express sample (Node.js)

One Express + Pug web app with the Node.js samples for **Rest PKI Core**, **Rest PKI**,
**PKI Express**, **Amplia**, **CloudHub** and **Web PKI**. Each module in `routes/` is one sample,
mounted at `/<module-name>`; views are in `views/<module-name>/`, and page scripts in
`public/javascripts/`.

## Samples in this project

Every row is an entry in the repository catalog ([samples.json](../../samples.json),
[SAMPLES.md](../../SAMPLES.md)). Open the URL once the app is running.

<!-- BEGIN GENERATED SAMPLES LIST (project: nodejs/expressmvc) -->
| Sample | Product | Entry file | Open |
|---|---|---|---|
| Sign a PDF with Rest PKI Core<br>`pades-signature-rest-pki-core` | Rest PKI Core | [pades-signature-core.js](routes/pades-signature-core.js) | http://localhost:3000/check-rest-pki-core-api-key?rc=server-files&fwd=pades-signature&op=signPdf |
| Sign a PDF with PKI Express<br>`pades-signature-pki-express` | PKI Express | [pades-signature-express.js](routes/pades-signature-express.js) | http://localhost:3000/check-pki-express?rc=server-files&fwd=pades-signature&op=signPdf |
| Sign a PDF with Rest PKI<br>`pades-signature-rest-pki` | Rest PKI | [pades-signature-restpki.js](routes/pades-signature-restpki.js) | http://localhost:3000/check-restpki-token?rc=server-files&fwd=pades-signature&op=signPdf |
| Sign a PDF with Rest PKI without browser access to Rest PKI<br>`pades-signature-without-communication-rest-pki` | Rest PKI | [pades-wo-communication-restpki.js](routes/pades-wo-communication-restpki.js) | http://localhost:3000/upload?rc=pades-wo-communication-restpki |
| Sign multiple PDFs with Rest PKI Core<br>`batch-pades-signature-rest-pki-core` | Rest PKI Core | [batch-pades-signature-core.js](routes/batch-pades-signature-core.js) | http://localhost:3000/check-rest-pki-core-api-key?rc=batch-pades-signature |
| Sign multiple PDFs with PKI Express<br>`batch-pades-signature-pki-express` | PKI Express | [batch-pades-signature-express.js](routes/batch-pades-signature-express.js) | http://localhost:3000/check-pki-express?rc=batch-pades-signature |
| Sign multiple PDFs with Rest PKI<br>`batch-pades-signature-rest-pki` | Rest PKI | [batch-pades-signature-restpki.js](routes/batch-pades-signature-restpki.js) | http://localhost:3000/check-restpki-token?rc=batch-pades-signature |
| Sign a PDF with a server key using PKI Express<br>`pades-signature-server-key-pki-express` | PKI Express | [pades-server-key-express.js](routes/pades-server-key-express.js) | http://localhost:3000/check-pki-express?rc=upload&fwd=pades-server-key |
| Sign a PDF with a cloud certificate using CloudHub<br>`sign-with-cloud-certificate-cloudhub` | CloudHub | [pades-signature-cloudhub-restpki.js](routes/pades-signature-cloudhub-restpki.js) | http://localhost:3000/check-restpki-token?rc=server-files&fwd=pades-signature-cloudhub&op=signPdf |
| Sign a PDF with a cloud certificate (OAuth flow) using PKI Express<br>`pades-signature-cloud-oauth-pki-express` | PKI Express | [pades-cloud-oauth-express.js](routes/pades-cloud-oauth-express.js) | http://localhost:3000/check-pki-express?rc=upload&fwd=pades-cloud-oauth |
| Sign a PDF with a cloud certificate (password flow) using PKI Express<br>`pades-signature-cloud-password-pki-express` | PKI Express | [pades-cloud-pwd-express.js](routes/pades-cloud-pwd-express.js) | http://localhost:3000/check-pki-express?rc=upload&fwd=pades-cloud-pwd |
| Timestamp a PDF with PKI Express<br>`timestamp-pdf-pki-express` | PKI Express | [timestamp-pdf-express.js](routes/timestamp-pdf-express.js) | http://localhost:3000/check-pki-express?rc=server-files&fwd=timestamp-pdf&op=signPdf |
| Sign a file with CAdES using PKI Express<br>`cades-signature-pki-express` | PKI Express | [cades-signature-express.js](routes/cades-signature-express.js) | http://localhost:3000/check-pki-express?rc=server-files&fwd=cades-signature&op=signCms |
| Sign a file with CAdES using Rest PKI<br>`cades-signature-rest-pki` | Rest PKI | [cades-signature-restpki.js](routes/cades-signature-restpki.js) | http://localhost:3000/check-restpki-token?rc=server-files&fwd=cades-signature&op=signCms |
| Sign multiple files with CAdES using PKI Express<br>`batch-cades-signature-pki-express` | PKI Express | [batch-cades-signature-express.js](routes/batch-cades-signature-express.js) | http://localhost:3000/check-pki-express?rc=batch-cades-signature |
| Sign multiple files with CAdES using Rest PKI<br>`batch-cades-signature-rest-pki` | Rest PKI | [batch-cades-signature-restpki.js](routes/batch-cades-signature-restpki.js) | http://localhost:3000/check-restpki-token?rc=batch-cades-signature |
| Sign a file with CAdES and a server key using PKI Express<br>`cades-signature-server-key-pki-express` | PKI Express | [cades-server-key-express.js](routes/cades-server-key-express.js) | http://localhost:3000/check-pki-express?rc=upload&fwd=cades-server-key |
| Merge CMS/CAdES signatures using PKI Express<br>`merge-cades-signatures-pki-express` | PKI Express | [merge-cades-express.js](routes/merge-cades-express.js) | http://localhost:3000/check-pki-express?rc=merge-server-files&fwd=merge-cades |
| Sign an XML document using PKI Express<br>`xml-signature-pki-express` | PKI Express | [xml-signature-express.js](routes/xml-signature-express.js) | http://localhost:3000/check-pki-express?rc=xml-signature |
| Sign an XML document using Rest PKI<br>`xml-signature-rest-pki` | Rest PKI | [xml-signature-restpki.js](routes/xml-signature-restpki.js) | http://localhost:3000/check-restpki-token?rc=xml-signature |
| Sign an XML document with a server key using PKI Express<br>`xml-signature-server-key-pki-express` | PKI Express | [xml-server-key-express.js](routes/xml-server-key-express.js) | http://localhost:3000/check-pki-express?rc=xml-server-key |
| Sign an XML document with a cloud certificate (OAuth flow) using PKI Express<br>`xml-signature-cloud-oauth-pki-express` | PKI Express | [xml-cloud-oauth-express.js](routes/xml-cloud-oauth-express.js) | http://localhost:3000/check-pki-express?rc=xml-cloud-oauth |
| Sign a Brazilian NF-e using PKI Express<br>`xml-nfe-signature-pki-express` | PKI Express | [xml-nfe-signature-express.js](routes/xml-nfe-signature-express.js) | http://localhost:3000/check-pki-express?rc=xml-nfe-signature |
| Sign a Brazilian NF-e using Rest PKI<br>`xml-nfe-signature-rest-pki` | Rest PKI | [xml-nfe-signature-restpki.js](routes/xml-nfe-signature-restpki.js) | http://localhost:3000/check-restpki-token?rc=xml-nfe-signature |
| Validate a signed PDF using PKI Express<br>`validate-pades-signature-pki-express` | PKI Express | [open-pades-express.js](routes/open-pades-express.js) | http://localhost:3000/check-pki-express?rc=upload&fwd=open-pades |
| Validate a signed PDF using Rest PKI<br>`validate-pades-signature-rest-pki` | Rest PKI | [open-pades-restpki.js](routes/open-pades-restpki.js) | http://localhost:3000/check-restpki-token?rc=upload&fwd=open-pades |
| Validate a CMS/CAdES signature using PKI Express<br>`validate-cades-signature-pki-express` | PKI Express | [open-cades-express.js](routes/open-cades-express.js) | http://localhost:3000/check-pki-express?rc=upload&fwd=open-cades |
| Validate a CMS/CAdES signature using Rest PKI<br>`validate-cades-signature-rest-pki` | Rest PKI | [open-cades-restpki.js](routes/open-cades-restpki.js) | http://localhost:3000/check-restpki-token?rc=upload&fwd=open-cades |
| Make a printer-friendly version of a signed PDF using PKI Express<br>`printer-friendly-pdf-pki-express` | PKI Express | [printer-version-pades-express.js](routes/printer-version-pades-express.js) | http://localhost:3000/check-pki-express?rc=upload&fwd=printer-version-pades |
| Make a printer-friendly version of a signed PDF using Rest PKI<br>`printer-friendly-pdf-rest-pki` | Rest PKI | [printer-version-pades-restpki.js](routes/printer-version-pades-restpki.js) | http://localhost:3000/check-restpki-token?rc=upload&fwd=printer-version-pades |
| Make a printer-friendly version of a CMS/CAdES signature using PKI Express<br>`printer-friendly-cades-pki-express` | PKI Express | [printer-version-cades-express.js](routes/printer-version-cades-express.js) | http://localhost:3000/check-pki-express?rc=upload&fwd=printer-version-cades |
| Authenticate with a digital certificate using PKI Express<br>`authentication-pki-express` | PKI Express | [authentication-express.js](routes/authentication-express.js) | http://localhost:3000/check-pki-express?rc=authentication |
| Authenticate with a digital certificate using Rest PKI<br>`authentication-rest-pki` | Rest PKI | [authentication-restpki.js](routes/authentication-restpki.js) | http://localhost:3000/check-restpki-token?rc=authentication |
| Authenticate with a cloud certificate using CloudHub<br>`authentication-cloudhub` | CloudHub | [authentication-cloudhub.js](routes/authentication-cloudhub.js) | http://localhost:3000/authentication-cloudhub |
| List the user's certificates with Web PKI<br>`list-certificates-web-pki` | Web PKI | [list-cert-jquery.js](routes/list-cert-jquery.js) | http://localhost:3000/list-cert-jquery |
| Read a certificate's details with Web PKI<br>`read-certificate-web-pki` | Web PKI | [read-cert-jquery.js](routes/read-cert-jquery.js) | http://localhost:3000/read-cert-jquery |
| Sign data with RSA in the browser using Web PKI<br>`rsa-signature-web-pki` | Web PKI | [rsa-web.js](routes/rsa-web.js) | http://localhost:3000/rsa-web |
| Issue a certificate with the key on the user's machine using Amplia<br>`issue-certificate-user-key-amplia` | Amplia | [issue-cert-user-amplia.js](routes/issue-cert-user-amplia.js) | http://localhost:3000/check-amplia-api-key?rc=issue-cert-user |
| Issue a certificate with the key on the server using Amplia<br>`issue-certificate-server-key-amplia` | Amplia | [issue-cert-server-amplia.js](routes/issue-cert-server-amplia.js) | http://localhost:3000/check-amplia-api-key?rc=issue-cert-server |
| Issue a PKCS #12 certificate using Amplia<br>`issue-pkcs12-certificate-amplia` | Amplia | [issue-pkcs12-cert-server-amplia.js](routes/issue-pkcs12-cert-server-amplia.js) | http://localhost:3000/issue-pkcs12-cert-server-amplia |
| Sign a medical prescription (Receita Simples) using PKI Express<br>`prescription-signature-pki-express` | PKI Express | [receita-simples-express.js](routes/receita-simples-express.js) | http://localhost:3000/receita-simples-express |
<!-- END GENERATED SAMPLES LIST -->

## Run

Run from this folder, because the app resolves `config/`, `app-data/` and `resources/` from the
working directory:

```bash
npm install
npm start
```

Then open http://localhost:3000/. The PKI Express samples also need PKI Express installed and
activated (`sudo pkie activate LacunaPkiLicense.config`).

## Configuration

- `config/default.js`, merged with `config/<NODE_ENV>.js` (`config/development.js` when
  `NODE_ENV` is unset): Rest PKI, Rest PKI Core, Amplia, CloudHub, PKI Express and Web PKI
  settings. Every key is documented in [`config/default.js.example`](config/default.js.example).
- The committed values are trial credentials rotated by `update-licenses.ps1`. Do not replace them
  in this repository.

See also: [Node.js samples README](../README.md), [AGENTS.md](../../AGENTS.md).
