# Repository metadata (to apply by hand)

These GitHub settings cannot be set from files in the repository. A maintainer with admin rights
applies them once, in **Settings → General** (description and website) and in the **About** panel
(topics), or with the `gh` command at the end of this file.

## Description

> Sample apps for Lacuna PKI Suite: PAdES, CAdES and XAdES signatures, validation, timestamps, certificate login and issuance with Rest PKI Core, PKI SDK, PKI Express, Web PKI and Amplia, in .NET, Java, Node.js, PHP, Python and Ruby.

## Website

`https://docs.lacunasoftware.com/en-us`

Use it **without** a trailing slash. On 2026-10-11, `https://docs.lacunasoftware.com/en-us/`
returned 404, while `https://docs.lacunasoftware.com/en-us` returned 200.

## Topics (12)

`digital-signature`, `pki`, `pades`, `cades`, `xades`, `icp-brasil`, `web-pki`, `dotnet`, `java`,
`nodejs`, `php`, `python`

GitHub allows up to 20 topics. If you want more, good candidates are `ruby`, `x509`,
`electronic-signature` and `code-samples`.

## Apply with the GitHub CLI

```bash
gh repo edit LacunaSoftware/PkiSuiteSamples --description "Sample apps for Lacuna PKI Suite: PAdES, CAdES and XAdES signatures, validation, timestamps, certificate login and issuance with Rest PKI Core, PKI SDK, PKI Express, Web PKI and Amplia, in .NET, Java, Node.js, PHP, Python and Ruby." --homepage "https://docs.lacunasoftware.com/en-us" --add-topic digital-signature,pki,pades,cades,xades,icp-brasil,web-pki,dotnet,java,nodejs,php,python
```
