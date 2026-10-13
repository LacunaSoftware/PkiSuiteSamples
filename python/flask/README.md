# Flask sample (Python)

One Flask web app (package `sample`) with the Python samples for **Rest PKI**, **Rest PKI Core**,
**PKI Express**, **Amplia** and **Web PKI**. Each module in `sample/views/` is one sample (a blueprint); its
templates are in `sample/templates/<module>/`.

## Samples in this project

Every row is an entry in the repository catalog ([samples.json](../../samples.json),
[SAMPLES.md](../../SAMPLES.md)). Open the URL once the app is running.

<!-- BEGIN GENERATED SAMPLES LIST (project: python/flask) -->
| Sample | Product | Entry file | Open |
|---|---|---|---|
| Sign a PDF with Rest PKI Core<br>`pades-signature-rest-pki-core` | Rest PKI Core | [pades_signature_rest_core.py](sample/views/pades_signature_rest_core.py) | http://localhost:5000/check-rest-pki-core-api-key/server-files/pades-signature/signPdf |
| Sign a PDF with PKI Express<br>`pades-signature-pki-express` | PKI Express | [pades_signature_express.py](sample/views/pades_signature_express.py) | http://localhost:5000/check-express/server-files/pades-signature/signPdf |
| Sign a PDF with Rest PKI<br>`pades-signature-rest-pki` | Rest PKI | [pades_signature_rest.py](sample/views/pades_signature_rest.py) | http://localhost:5000/check-rest-token/server-files/pades-signature/signPdf |
| Sign multiple PDFs with PKI Express<br>`batch-pades-signature-pki-express` | PKI Express | [batch_pades_express.py](sample/views/batch_pades_express.py) | http://localhost:5000/check-express/batch-pades |
| Sign multiple PDFs with Rest PKI<br>`batch-pades-signature-rest-pki` | Rest PKI | [batch_pades_rest.py](sample/views/batch_pades_rest.py) | http://localhost:5000/check-rest-token/batch-pades |
| Sign a PDF with a server key using PKI Express<br>`pades-signature-server-key-pki-express` | PKI Express | [pades_server_key_express.py](sample/views/pades_server_key_express.py) | http://localhost:5000/check-express/upload/pades-server-key |
| Sign a PDF with a cloud certificate (OAuth flow) using PKI Express<br>`pades-signature-cloud-oauth-pki-express` | PKI Express | [pades_cloud_oauth_express.py](sample/views/pades_cloud_oauth_express.py) | http://localhost:5000/check-express/upload/pades-cloud-oauth |
| Sign a PDF with a cloud certificate (password flow) using PKI Express<br>`pades-signature-cloud-password-pki-express` | PKI Express | [pades_cloud_pwd_express.py](sample/views/pades_cloud_pwd_express.py) | http://localhost:5000/check-express/upload/pades-cloud-pwd |
| Timestamp a PDF with PKI Express<br>`timestamp-pdf-pki-express` | PKI Express | [timestamp_pdf_express.py](sample/views/timestamp_pdf_express.py) | http://localhost:5000/check-express/server-files/pades-signature/signPdf |
| Timestamp a PDF with Rest PKI Core<br>`timestamp-pdf-rest-pki-core` | Rest PKI Core | [timestamp_pdf_rest_core.py](sample/views/timestamp_pdf_rest_core.py) | http://localhost:5000/check-rest-pki-core-api-key/upload/timestamp-pdf |
| Sign a file with CAdES using PKI Express<br>`cades-signature-pki-express` | PKI Express | [cades_signature_express.py](sample/views/cades_signature_express.py) | http://localhost:5000/check-express/server-files/cades-signature/signCms |
| Sign a file with CAdES using Rest PKI<br>`cades-signature-rest-pki` | Rest PKI | [cades_signature_rest.py](sample/views/cades_signature_rest.py) | http://localhost:5000/check-rest-token/server-files/cades-signature/signCms |
| Sign multiple files with CAdES using PKI Express<br>`batch-cades-signature-pki-express` | PKI Express | [batch_cades_express.py](sample/views/batch_cades_express.py) | http://localhost:5000/check-express/batch-cades |
| Sign multiple files with CAdES using Rest PKI<br>`batch-cades-signature-rest-pki` | Rest PKI | [batch_cades_rest.py](sample/views/batch_cades_rest.py) | http://localhost:5000/check-rest-token/batch-cades |
| Sign a file with CAdES and a server key using PKI Express<br>`cades-signature-server-key-pki-express` | PKI Express | [cades_server_key_express.py](sample/views/cades_server_key_express.py) | http://localhost:5000/check-express/upload/cades-server-key |
| Merge CMS/CAdES signatures using PKI Express<br>`merge-cades-signatures-pki-express` | PKI Express | [merge_cades_express.py](sample/views/merge_cades_express.py) | http://localhost:5000/check-express/merge-server-files/merge-cades |
| Sign an XML document using Rest PKI<br>`xml-signature-rest-pki` | Rest PKI | [xml_signature_rest.py](sample/views/xml_signature_rest.py) | http://localhost:5000/check-rest-token/xml-signature |
| Sign a Brazilian NF-e using Rest PKI<br>`xml-nfe-signature-rest-pki` | Rest PKI | [xml_nfe_signature_rest.py](sample/views/xml_nfe_signature_rest.py) | http://localhost:5000/check-rest-token/xml-nfe-signature |
| Validate a signed PDF using PKI Express<br>`validate-pades-signature-pki-express` | PKI Express | [open_pades_express.py](sample/views/open_pades_express.py) | http://localhost:5000/check-express/upload/open-pades |
| Validate a signed PDF using Rest PKI<br>`validate-pades-signature-rest-pki` | Rest PKI | [open_pades_rest.py](sample/views/open_pades_rest.py) | http://localhost:5000/check-rest-token/upload/open-pades |
| Validate a CMS/CAdES signature using PKI Express<br>`validate-cades-signature-pki-express` | PKI Express | [open_cades_express.py](sample/views/open_cades_express.py) | http://localhost:5000/check-express/upload/open-cades |
| Make a printer-friendly version of a signed PDF using PKI Express<br>`printer-friendly-pdf-pki-express` | PKI Express | [printer_version_pades_express.py](sample/views/printer_version_pades_express.py) | http://localhost:5000/check-express/upload/printer-version-pades |
| Make a printer-friendly version of a signed PDF using Rest PKI<br>`printer-friendly-pdf-rest-pki` | Rest PKI | [printer_version_pades_rest.py](sample/views/printer_version_pades_rest.py) | http://localhost:5000/check-rest-token/upload/printer-version-pades |
| Authenticate with a digital certificate using PKI Express<br>`authentication-pki-express` | PKI Express | [authentication_express.py](sample/views/authentication_express.py) | http://localhost:5000/check-express/authentication |
| Authenticate with a digital certificate using Rest PKI<br>`authentication-rest-pki` | Rest PKI | [authentication_rest.py](sample/views/authentication_rest.py) | http://localhost:5000/check-rest-token/authentication |
| List the user's certificates with Web PKI<br>`list-certificates-web-pki` | Web PKI | [list_cert_jquery.py](sample/views/list_cert_jquery.py) | http://localhost:5000/list-cert-jquery |
| Read a certificate's details with Web PKI<br>`read-certificate-web-pki` | Web PKI | [read_cert_jquery.py](sample/views/read_cert_jquery.py) | http://localhost:5000/read-cert-jquery |
| Sign data with RSA in the browser using Web PKI<br>`rsa-signature-web-pki` | Web PKI | [rsa_web.py](sample/views/rsa_web.py) | http://localhost:5000/rsa-web |
| Issue a certificate with the key on the user's machine using Amplia<br>`issue-certificate-user-key-amplia` | Amplia | [issue_cert_user_amplia.py](sample/views/issue_cert_user_amplia.py) | http://localhost:5000/check-amplia-api-key/issue-cert-user |
| Issue a certificate with the key on the server using Amplia<br>`issue-certificate-server-key-amplia` | Amplia | [issue_cert_server_amplia.py](sample/views/issue_cert_server_amplia.py) | http://localhost:5000/check-amplia-api-key/issue-cert-server |
<!-- END GENERATED SAMPLES LIST -->

## Run

Use Python 3.11 or older: `sample/__init__.py` imports the `imp` module, which Python 3.12 removed.

```bash
pip install -r requirements.txt
FLASK_APP=sample FLASK_ENV=development flask run
```

`FLASK_ENV` is required: it selects the config class, and `development` is the one that trusts
Lacuna test certificates. Then open http://localhost:5000/. The PKI Express samples also need PKI
Express installed and activated (`sudo pkie activate LacunaPkiLicense.config`). The
`.devcontainer/` folder builds a container with PKI Express already set up.

## Configuration

- `sample/config.py`: Rest PKI, Rest PKI Core, Amplia, PKI Express and Web PKI settings, with one class per
  `FLASK_ENV`. Every key is documented in [`sample/config.py.example`](sample/config.py.example).
- The committed values are trial credentials rotated by `update-licenses.ps1`. Do not replace them
  in this repository.

See also: [Python samples README](../README.md), [AGENTS.md](../../AGENTS.md).
