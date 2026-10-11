# Repository metadata (to apply by hand)

These GitHub settings cannot be set from files in the repository. A maintainer with admin rights
applies them once, in **Settings → General** (description and website) and in the **About** panel
(topics), or with the script at the end of this file.

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

## Apply with the script

[`apply-repo-metadata.ps1`](apply-repo-metadata.ps1) reads the Description, Website and Topics
sections above, shows what differs from GitHub, and applies the difference with the GitHub CLI.
It needs `gh`, signed in as a repository admin, and runs in Windows PowerShell 5.1 or PowerShell 7+.

```powershell
./.github/apply-repo-metadata.ps1 -WhatIf   # preview only
./.github/apply-repo-metadata.ps1           # apply (asks for confirmation)
```

Topics are only added. Add `-RemoveOtherTopics` to also remove topics that are not listed above.
After you change this file, run the script again to sync GitHub.

## Apply with the GitHub CLI directly

```bash
gh repo edit LacunaSoftware/PkiSuiteSamples --description "Sample apps for Lacuna PKI Suite: PAdES, CAdES and XAdES signatures, validation, timestamps, certificate login and issuance with Rest PKI Core, PKI SDK, PKI Express, Web PKI and Amplia, in .NET, Java, Node.js, PHP, Python and Ruby." --homepage "https://docs.lacunasoftware.com/en-us" --add-topic digital-signature,pki,pades,cades,xades,icp-brasil,web-pki,dotnet,java,nodejs,php,python
```
