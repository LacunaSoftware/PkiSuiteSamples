# The ASP.NET Core + Angular project has its own home page and uses Rest PKI Core only

Status: accepted (2026-10-12, issue #147)

The project in `dotnet/spa/PkiSuiteAspNetCoreAngularSample` replaces the ASP.NET Core 3.1 + Angular 8 project. It differs from every other project in two ways on purpose.

**Its own home page.** The other projects embed the shared home app from `cdn.lacunasoftware.com` and configure it through `SampleRoutes`. That bundle is an Angular 8-era build. Loading it next to a current Angular app means running two Angular apps on one page, and the old project needed a `/RedirectToSPA` hop between them. The new project lists its samples in its own Angular home page instead, so its home looks different from the other projects'.

**Rest PKI Core only, no Rest PKI (v1).** AGENTS.md section 4 says new integrations should use Rest PKI Core. Mixing in v1 would bring back the token flow (`signWithRestPki`) next to the hash flow (`signHash`), which is the confusion AGENTS.md 5c warns about. When Rest PKI Core cannot do a task, the project ships that task with PKI SDK only and does not fall back to v1. NF-e XML signature is such a task: the Rest PKI Core API has no signature-policy or ID-resolution options for it. PAdES validation calls the Rest PKI Core `signature-inspection` endpoint over HTTP, because the .NET client has no method for it.

## Consequences

- `scripts/ci/smoke-test.py` cannot treat this project like the others. Every Angular route returns `index.html` with status 200, so the smoke test also checks for `<app-root>`, looks for each sample's route in the app's JavaScript (unknown routes show a not-found page), and calls a JSON API endpoint.
- Do not "fix" the home page by wiring in `SampleRoutes`, or add v1 samples to this project. Rest PKI v1 on .NET lives in `dotnet/mvc`.
