# Rails sample (Ruby)

One Rails 8.1 web app (Ruby 3.3) with the Ruby samples for **Rest PKI**, **Rest PKI Core**, **PKI Express** and
**Web PKI**. Each controller in `app/controllers/` is one sample; its views are in
`app/views/<controller>/`, and page scripts in `app/assets/javascripts/`. Shared helpers are in
`app/controllers/concerns/`. There is no Rest PKI Core client library for Ruby, so the Rest PKI Core
sample calls the API with the small `RestPkiCoreClient` class in `app/controllers/concerns/`.

## Samples in this project

Every row is an entry in the repository catalog ([samples.json](../../samples.json),
[SAMPLES.md](../../SAMPLES.md)). Open the URL once the app is running.

<!-- BEGIN GENERATED SAMPLES LIST (project: ruby/rails) -->
| Sample | Product | Entry file | Open |
|---|---|---|---|
| Sign a PDF with Rest PKI Core<br>`pades-signature-rest-pki-core` | Rest PKI Core | [pades_signature_rest_core_controller.rb](app/controllers/pades_signature_rest_core_controller.rb) | http://localhost:3000/check-rest-pki-core-api-key/server-files/pades-signature/sign-pdf |
| Sign a PDF with PKI Express<br>`pades-signature-pki-express` | PKI Express | [pades_signature_express_controller.rb](app/controllers/pades_signature_express_controller.rb) | http://localhost:3000/check-express/server-files/pades-signature/sign-pdf |
| Sign a PDF with Rest PKI<br>`pades-signature-rest-pki` | Rest PKI | [pades_signature_rest_controller.rb](app/controllers/pades_signature_rest_controller.rb) | http://localhost:3000/check-rest-token/server-files/pades-signature/sign-pdf |
| Sign multiple PDFs with PKI Express<br>`batch-pades-signature-pki-express` | PKI Express | [batch_pades_express_controller.rb](app/controllers/batch_pades_express_controller.rb) | http://localhost:3000/check-express/batch-pades/ |
| Sign multiple PDFs with Rest PKI<br>`batch-pades-signature-rest-pki` | Rest PKI | [batch_pades_rest_controller.rb](app/controllers/batch_pades_rest_controller.rb) | http://localhost:3000/check-rest-token/batch-pades/ |
| Sign a PDF with a server key using PKI Express<br>`pades-signature-server-key-pki-express` | PKI Express | [pades_server_key_express_controller.rb](app/controllers/pades_server_key_express_controller.rb) | http://localhost:3000/check-express/upload/pades-server-key |
| Sign a PDF with a cloud certificate (OAuth flow) using PKI Express<br>`pades-signature-cloud-oauth-pki-express` | PKI Express | [pades_cloud_oauth_express_controller.rb](app/controllers/pades_cloud_oauth_express_controller.rb) | http://localhost:3000/check-express/upload/pades-cloud-oauth |
| Sign a PDF with a cloud certificate (password flow) using PKI Express<br>`pades-signature-cloud-password-pki-express` | PKI Express | [pades_cloud_pwd_express_controller.rb](app/controllers/pades_cloud_pwd_express_controller.rb) | http://localhost:3000/check-express/upload/pades-cloud-pwd |
| Timestamp a PDF with Rest PKI Core<br>`timestamp-pdf-rest-pki-core` | Rest PKI Core | [timestamp_pdf_rest_core_controller.rb](app/controllers/timestamp_pdf_rest_core_controller.rb) | http://localhost:3000/check-rest-pki-core-api-key/upload/timestamp-pdf |
| Sign a file with CAdES using PKI Express<br>`cades-signature-pki-express` | PKI Express | [cades_signature_express_controller.rb](app/controllers/cades_signature_express_controller.rb) | http://localhost:3000/check-express/server-files/cades-signature/sign-cms |
| Sign a file with CAdES using Rest PKI<br>`cades-signature-rest-pki` | Rest PKI | [cades_signature_rest_controller.rb](app/controllers/cades_signature_rest_controller.rb) | http://localhost:3000/check-rest-token/server-files/cades-signature/sign-cms |
| Sign multiple files with CAdES using PKI Express<br>`batch-cades-signature-pki-express` | PKI Express | [batch_cades_express_controller.rb](app/controllers/batch_cades_express_controller.rb) | http://localhost:3000/check-express/batch-cades/ |
| Sign multiple files with CAdES using Rest PKI<br>`batch-cades-signature-rest-pki` | Rest PKI | [batch_cades_rest_controller.rb](app/controllers/batch_cades_rest_controller.rb) | http://localhost:3000/check-rest-token/batch-cades/ |
| Sign an XML document using Rest PKI<br>`xml-signature-rest-pki` | Rest PKI | [xml_signature_rest_controller.rb](app/controllers/xml_signature_rest_controller.rb) | http://localhost:3000/check-rest-token/xml-signature/ |
| Sign a Brazilian NF-e using Rest PKI<br>`xml-nfe-signature-rest-pki` | Rest PKI | [xml_nfe_signature_rest_controller.rb](app/controllers/xml_nfe_signature_rest_controller.rb) | http://localhost:3000/check-rest-token/xml-nfe-signature/ |
| Validate a signed PDF using PKI Express<br>`validate-pades-signature-pki-express` | PKI Express | [open_pades_express_controller.rb](app/controllers/open_pades_express_controller.rb) | http://localhost:3000/check-express/upload/open-pades |
| Validate a signed PDF using Rest PKI<br>`validate-pades-signature-rest-pki` | Rest PKI | [open_pades_rest_controller.rb](app/controllers/open_pades_rest_controller.rb) | http://localhost:3000/check-rest-token/upload/open-pades |
| Make a printer-friendly version of a signed PDF using Rest PKI<br>`printer-friendly-pdf-rest-pki` | Rest PKI | [printer_version_pades_rest_controller.rb](app/controllers/printer_version_pades_rest_controller.rb) | http://localhost:3000/check-rest-token/upload/printer-version-pades |
| Authenticate with a digital certificate using Rest PKI<br>`authentication-rest-pki` | Rest PKI | [authentication_rest_controller.rb](app/controllers/authentication_rest_controller.rb) | http://localhost:3000/check-rest-token/authentication/ |
| List the user's certificates with Web PKI<br>`list-certificates-web-pki` | Web PKI | [list_cert_jquery_controller.rb](app/controllers/list_cert_jquery_controller.rb) | http://localhost:3000/list-cert-jquery/ |
| Read a certificate's details with Web PKI<br>`read-certificate-web-pki` | Web PKI | [read_cert_jquery_controller.rb](app/controllers/read_cert_jquery_controller.rb) | http://localhost:3000/read-cert-jquery/ |
| Sign data with RSA in the browser using Web PKI<br>`rsa-signature-web-pki` | Web PKI | [rsa_web_controller.rb](app/controllers/rsa_web_controller.rb) | http://localhost:3000/rsa-web/ |
| Sign a medical prescription (Receita Simples) using PKI Express<br>`prescription-signature-pki-express` | PKI Express | [receita_simples_express_controller.rb](app/controllers/receita_simples_express_controller.rb) | http://localhost:3000/receita-simples-express/ |
<!-- END GENERATED SAMPLES LIST -->

## Run

Requires Ruby 3.3 (see `.ruby-version`) and Bundler. On Windows, install Ruby with RubyInstaller's
"with Devkit" package: Bundler compiles the gems that have no prebuilt Windows version, such as
Puma. Node.js is not needed: there is no JavaScript build step. The views load jQuery, Bootstrap
and Web PKI from their CDNs, and the page scripts in `app/assets/javascripts/` go through the Rails
asset pipeline (Sprockets).

```bash
bundle install
rails server
```

Then open http://localhost:3000/. `rails server` runs Puma, configured in `config/puma.rb`. The PKI
Express samples also need PKI Express installed and activated
(`sudo pkie activate LacunaPkiLicense.config`).

### Temporary `File.exists?` shim for PKI Express

`pki_express` 1.3.2 and earlier call `File.exists?`, which Ruby 3.2 removed, so every PKI Express
sample would fail with `NoMethodError` as soon as it sets a file path.
[`config/initializers/pki_express_ruby32_compat.rb`](config/initializers/pki_express_ruby32_compat.rb)
aliases it back to `File.exist?`. It is a workaround, not part of the integration: your app needs
it only if it uses the `pki_express` gem on Ruby 3.2 or later. Delete it once `pki_express` ships a
fixed release.

## Configuration

- `config/lacuna.yml`, one section per Rails environment: Rest PKI, Rest PKI Core, PKI Express and
  Web PKI settings. Every key is documented in [`config/lacuna.yml.example`](config/lacuna.yml.example).
  This is where the Rest PKI token goes (`rest_pki.access_token`), not
  `config/initializers/restpki.rb`.
- The committed token is a trial credential rotated by `update-licenses.ps1`. Do not replace it in
  this repository.

See also: [Ruby samples README](../README.md), [AGENTS.md](../../AGENTS.md).
