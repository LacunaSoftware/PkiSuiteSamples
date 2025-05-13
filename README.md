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
