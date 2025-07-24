# PKI Suite samples

This repository contains sample projects demonstrating the usage of Lacuna Software's
**[PKI Suite](https://www.lacunasoftware.com/pki-suite)** in various programming languages and frameworks.

**To get started, choose a programming language:**

* [.NET](dotnet/)
* [Java](java/)
* [PHP](php/)
* [Python](python/)
* [Node.js](nodejs/)
* [Ruby](ruby/)

## See also

* [PKI Suite demos](https://demos.lacunasoftware.com/)
* [Documentation](https://docs.lacunasoftware.com/)
* [Test certificates](https://docs.lacunasoftware.com/articles/pki-guide/test-certs)
* [Lacuna Software website](https://www.lacunasoftware.com/)

## For Devs

### Running the update-licenses.ps1 Script

To update API keys and license files across the repository, follow these steps:

1. Open a PowerShell terminal in the repository root.
2. Run the script by executing:
   ```powershell
   ./update-licenses.ps1
   ```
3. Follow the prompts to enter your REST PKI API Key, REST PKI Core API Key, Amplia API Key, and the expiry date (format: DD/MM/YYYY).
4. Paste the new LacunaPkiLicense.config XML content when prompted.
5. The script will update all relevant files and report the number of files modified.

### What the Script Modifies

The `update-licenses.ps1` script performs the following changes:

*   **`dotnet/mvc/PkiSuiteAspNetMvcSample/Web.config`**:
    *   Updates `RestPkiAccessToken` (value for key "RestPkiAccessToken" with the RestPkiApiKey)
    *   Updates `RestPkiCoreApiKey` (value for key "RestPkiCoreApiKey")
    *   The `CloudHubApiKey` is intentionally skipped.
    *   Updates expiry date comments.
*   **`dotnet/spa/PkiSuiteAspNetSpaSample/appsettings.json`**:
    *   Updates `RestPki.AccessToken` (with the RestPkiApiKey)
    *   Updates expiry date comments.
*   **`java/springmvc/src/main/resources/application.yml`**:
    *   Sets `rest-pki.accessToken` (with the RestPkiApiKey)
    *   Sets `rest-pki-core.apiKey` (with the RestPkiCoreApiKey)
    *   Sets `amplia.apiKey` (with the AmpliaApiKey)
    *   Embeds expiry date comments in the new content.
    *   The `cloudhub.apiKey` is intentionally preserved with its existing value from the template.
*   **`nodejs/expressmvc/config/default.js`**:
    *   Updates `restPki.accessToken` (with the RestPkiApiKey)
    *   Updates `amplia.apiKey` (with the AmpliaApiKey)
    *   Sets `rest-pki-core.apiKey` (with the RestPkiCoreApiKey)
    *   Updates expiry date comments.
    *   The `cloudhub.apiKey` is intentionally skipped.
*   **`php/plain/config.php`**:
    *   Updates `'restPki' => 'accessToken'` (with the RestPkiApiKey)
    *   Updates `'restPkiNg' => 'apiKey'` (with the RestPkiCoreApiKey)
    *   Updates `'amplia' => 'apiKey'` (with the AmpliaApiKey)
    *   Updates expiry date comments.
    *   The `cloudHub` section is intentionally not modified.
*   **`python/django/sample/config.py`**:
    *   Updates `REST_PKI_ACCESS_TOKEN` (with the RestPkiApiKey)
    *   Updates `AMPLIA_API_KEY` (with the AmpliaApiKey)
    *   Updates expiry date comments.
*   **`python/flask/sample/config.py`**:
    *   Updates `REST_PKI_ACCESS_TOKEN` (with the RestPkiApiKey)
    *   Updates `AMPLIA_API_KEY` (with the AmpliaApiKey)
    *   Updates expiry date comments.
*   **`ruby/rails/config/lacuna.yml`**:
    *   Updates `rest_pki.api_key` (with the RestPkiApiKey)
    *   Updates expiry date comments.
*   **`LacunaPkiLicense.config`** (all instances found in the repository, except `dotnet/mvc/PkiSuiteAspNetMvcSample/bin/LacunaPkiLicense.config`):
    *   The entire XML content is replaced with the new license content provided by the user.

If you have inserted a new key which requires updating in any of the documents listed above, please make the appropriate changes in the script.
