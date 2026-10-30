# AGENTS.md

Guidance for AI coding agents (Claude Code, Cursor, Copilot, Codex, ...) working in this
repository, usually on behalf of a developer who is integrating Lacuna Software's PKI Suite
into their own application.

## 1. What this repository is (and is not)

It **is** a set of runnable sample web apps that show how to call Lacuna's PKI Suite products
from .NET, Java, Node.js, PHP, Python and Ruby:

| Product | What it does | Where it runs |
|---|---|---|
| **Web PKI** | Browser extension and JS library: lists the user's certificates and signs with their private key | User's browser |
| **Rest PKI Core** | Lacuna's current cloud signing, validation and timestamp API | Lacuna cloud (or on-premises) |
| **Rest PKI** (v1) | The previous-generation cloud API. Still supported, and most samples still use it | Lacuna cloud (or on-premises) |
| **PKI SDK** | .NET library for signatures, validation and certificates on your own server | Your .NET server |
| **PKI Express** | Command-line engine with wrappers for Java, Node.js, PHP, Python and Ruby | Your server |
| **Amplia** | Certificate authority (CA) software: issues certificates | Lacuna cloud (or on-premises) |
| **CloudHub** | Signs with a user's cloud certificate held by a PSC (Brazilian cloud certificate provider) | Lacuna cloud |
| **Signer** | Document signing workflow product (see also SignerSamples) | Lacuna cloud |

It is **not** a production template. Copy the integration calls, not the scaffolding:

- Files are kept by a `StorageMock` class (a local folder such as `App_Data`, `app-data` or
  `private/files`). Replace it with your storage, and do not copy its file-id handling: it joins
  request input into file paths.
- There is no login and no authorization. Django has its CSRF middleware commented out, and
  Rails uses `protect_from_forgery with: :null_session`.
- Callback and return URLs are hardcoded to `http://localhost:<port>`.
- The committed API keys and `LacunaPkiLicense.config` files are short-lived **trial**
  credentials, rotated by `update-licenses.ps1`. Do not edit, move or "clean up" them. Your
  client needs their own credentials.
- `Pierre de Fermat.pfx` (password `1234`) is a public test certificate from Lacuna's test PKI,
  used by the server-key samples.

## 2. Find the right sample: use the catalog first

Before reading code, look the task up in the catalog:

- **[`samples.json`](samples.json)**: one entry per (task, language, framework). Schema:
  [`schema/samples.schema.json`](schema/samples.schema.json).
- **[`SAMPLES.md`](SAMPLES.md)**: the same data as tables grouped by task, with one column per
  language. It is generated from `samples.json`, so never edit it by hand.

Each entry has: `id` (slug), `title` (and `title_pt`, in Brazilian Portuguese), `description`,
`product`, `language`, `framework`, `path` (the entry file: controller, route module or page),
`related_files` (views, page scripts, models, helpers), `status`, `docs_url`, `demo_url`, and
`run` (`cwd`, `command`, `url`).

Slugs are `<task>-<product>`, for example `pades-signature-rest-pki-core` or
`authentication-pki-express`. The same slug in two languages means the same integration
pattern, so a sample in one language is a reliable guide for another.

```bash
# Every Java sample that uses PKI Express
python -c "import json;[print(e['id'],e['path']) for e in json.load(open('samples.json',encoding='utf-8')) if e['language']=='java' and e['product']=='pki-express']"
```

Read `path` first, then `related_files`. The browser half of a signature lives in the page
scripts listed there (`signature-start-form.js`, `signature-complete-form.js`,
`signature-form.js`, `authentication-form.js`, ...). Each project also has a shared helper with
the client factories and the security-context choice: `Classes/Util.cs`, `util/Util.java`,
`util.js`, `Util.php`, `utils.py` or `concerns/util.rb`.

## 3. Repository layout, how to run, where config lives

Layout: `<language>/<framework>/<project>`. Each project is one web app containing many samples.
Its home page is an Angular app served from `cdn.lacunasoftware.com` (not in this repo), driven
by a `SampleRoutes` object in the home view. Its links go through "check" routes
(`check-express`, `check-rest-token`, ...) that confirm the product is configured before
redirecting to the sample. The exception is `dotnet/spa`, an Angular app with its own home page
and no check routes, which uses Rest PKI Core and never Rest PKI (v1)
([ADR 0001](docs/adr/0001-aspnet-core-angular-project-deviations.md)).

| Project | Stack | Run from | Command | URL | Config the app reads |
|---|---|---|---|---|---|
| `dotnet/mvc/PkiSuiteAspNetMvcSample` | ASP.NET MVC 5, .NET Framework 4.8 | `dotnet/mvc` | Open `PkiSuiteAspNetMvcSample.sln` in Visual Studio, F5 (IIS Express) | http://localhost:54123 | `Web.config` `<appSettings>`; `LacunaPkiLicense.config` (copied to `bin/`) |
| `dotnet/spa/PkiSuiteAspNetCoreAngularSample` | ASP.NET Core (.NET 10) Web API + Angular 22 (`pkisuiteaspnetcoreangularsample.client/`), Node.js 24.15 or later | `dotnet/spa/PkiSuiteAspNetCoreAngularSample/PkiSuiteAspNetCoreAngularSample.Server` | `dotnet run --launch-profile http` (after `npm ci` in the client folder), or open the `.sln` in Visual Studio, F5 | http://localhost:4200 (Angular dev server; the API listens on http://localhost:5100) | `appsettings.json` (`RestPkiCore`, `WebPki`, `PkiSuite`), overridden by `appsettings.Development.json`; `LacunaPkiLicense.config` (loaded from the content root) |
| `dotnet/console/SkillFriendlySignatureApp` | .NET 10 console app, Windows only | `dotnet/console/SkillFriendlySignatureApp` | `dotnet run -- certs` (or `list`, `sign`; `--help` lists them) | none (prints JSON) | `appsettings.json`, then user secrets, then environment variables (`Signer__ApiKey`, `PkiSdk__License`); `LacunaPkiLicense.config` (next to the executable) |
| `java/springmvc` | Spring Boot 3.5, Java 21, Gradle 8.14 wrapper (or Maven) | `java/springmvc` | `./gradlew bootRun` (`gradlew.bat bootRun` on Windows) | http://localhost:60695 | `src/main/resources/application.yml`, overridden by `application-dev.yml` (profile `dev` is active) |
| `nodejs/expressmvc` | Express + Pug | `nodejs/expressmvc` | `npm install && npm start` | http://localhost:3000 | `config/default.js` merged with `config/<NODE_ENV>.js` (`development.js` by default) |
| `php/plain` | Plain PHP (Composer) | `php/plain` | `composer install && composer start` | http://localhost:8000 | `config.php` |
| `python/flask` | Flask | `python/flask` | `pip install -r requirements.txt && FLASK_APP=sample FLASK_ENV=development flask run` | http://localhost:5000 | `sample/config.py` (class picked by `FLASK_ENV`, which is required) |
| `python/django` | Django | `python/django/sample` | `pip install -r ../requirements.txt && python manage.py migrate && python manage.py runserver` | http://localhost:8000 | `sample/config.py`; `sample/PkiSuitePythonDjangoSample/settings.py` |
| `ruby/rails` | Rails 8.1, Ruby 3.3, Puma | `ruby/rails` | `bundle install && rails server` | http://localhost:3000 | `config/lacuna.yml` (one section per Rails environment) |

`dotnet/webapi` and `dotnet/webforms` are empty placeholders. Each project folder has a
`README.md` with its sample list, which is generated from the catalog.

In `dotnet/spa`, `dotnet run` starts the Angular dev server on port 4200 (SpaProxy), which
serves the pages and forwards `/api` to the server on port 5100. Port 5100 itself serves only
`/api` and a redirect from `/`: the Angular app reaches `wwwroot` only through
`dotnet publish -c Release`. CI publishes it and runs the output from the publish folder, which
is the content root. Each sample is an API controller `Controllers/<SampleId>Controller.cs` plus
the Angular folder `src/app/samples/<sample id>/`.

`dotnet/console` holds one sample, `sign-pending-documents-signer`: a CLI that lists a
participant's pending documents on Signer (DropSigner by default) and signs them with a
certificate from the Windows store through PKI SDK. A coding agent calls it through the Claude
Code skill in `skill/SKILL.md`, which a client copies to
`.claude/skills/sign-pending-documents/` in their project. It has no URL. Its xUnit tests run
with `dotnet test --solution SkillFriendlySignatureApp.slnx` from `dotnet/console`, and in CI
through `.github/workflows/test-console.yml`
([ADR 0002](docs/adr/0002-console-project-for-agent-driven-signing.md)).

`java/springmvc` needs JDK 21 or later. `mvn spring-boot:run` runs it too: `pom.xml` and
`build.gradle` declare the same dependencies, so change both when you change one.

Every key a project reads is listed, with placeholder values and a one-line comment, in an
`.example` file next to the real config file: `Web.config.example`,
`appsettings.json.example`, `application.yml.example`, `config/default.js.example`,
`config.php.example`, `sample/config.py.example` (Flask and Django) and
`config/lacuna.yml.example`. No app loads these files; they are documentation only.

Credentials the apps read (the files `update-licenses.ps1` rewrites):

- **Rest PKI** access token: `RestPkiAccessToken` (Web.config), `rest-pki.accessToken`
  (application.yml), `restPki.accessToken` (default.js), `restPki.accessToken` (config.php),
  `REST_PKI_ACCESS_TOKEN` (config.py), `rest_pki.access_token` (lacuna.yml).
- **Rest PKI Core** API key: `RestPkiCoreApiKey` (Web.config), `RestPkiCore:ApiKey`
  (appsettings.json), `rest-pki-core.apiKey`, `restPkiCore.apiKey`, `restPkiNg.apiKey` (PHP),
  `REST_PKI_CORE_API_KEY` (Flask), `rest_pki_core.api_key` (Rails).
- **Amplia** API key: `amplia.apiKey` / `AMPLIA_API_KEY`. **CloudHub**: `CloudHubApiKey` /
  `cloudhub.apiKey` / `cloudHub.apiKey`.
- **Signer** API key: `signer.apiKey` (application.yml), `Signer:ApiKey` (dotnet/console, best
  set with `dotnet user-secrets` or `Signer__ApiKey`). No Signer key is committed, and the
  script does not rotate one.
- **Web PKI** license: `WebPkiLicense` / `WebPki:License` / `web-pki.license` /
  `webPki.license` / `WEB_PKI_LICENSE` / `web_pki.license`. It is empty in every project, which
  is fine on localhost.
- **PKI SDK / PKI Express** license: `LacunaPkiLicense.config`. For PKI SDK it sits next to the
  app: the MVC app checks for it in `bin/`, and the ASP.NET Core app loads it from the content
  root in `Program.cs`. The console app loads it from the folder of the executable, unless
  `PkiSdk:License` (`PkiSdk__License`) holds a Base64 license. PKI Express must be installed and
  activated with it once per machine:
  `sudo pkie activate LacunaPkiLicense.config`, or `pkiemgr.exe` on Windows.

## 4. Which product to use

When a task can be done several ways, prefer, in order:

1. **Rest PKI Core** for a cloud API. Use it for new integrations instead of Rest PKI (v1),
   even though most samples here still use v1.
2. **PKI SDK** for on-premises signing in **.NET**.
3. **PKI Express** for on-premises signing **without .NET** (Java, Node.js, PHP, Python, Ruby).
4. **Web PKI** in the browser whenever the user signs with their own certificate. It always
   pairs with one of the above on the server, except in the browser-only samples.
5. For **cloud certificates** (PSCs), use **CloudHub**, or the trust-services OAuth and password
   flows in PKI SDK or PKI Express. For **issuing certificates**, use **Amplia**.

If the client's language has no Rest PKI Core sample for a task, adapt one from another
language. The Rest PKI Core browser-signing samples all follow the same two-step flow (prepare
or start, then complete) described in section 5.

## 5. Integration patterns agents get wrong

**a. The private key never leaves the user's machine.** Web PKI signs **only a hash** (or a
nonce) in the browser. The server receives the certificate (public) and the signature value,
never a private key. Never upload a `.pfx`, or ask for a key or its password, in a user-signing
flow. Only the `*-server-key-*` samples sign with a key on the server.

**b. Two-step signature: start, sign in the browser, complete.** Rest PKI Core, PKI SDK and
PKI Express all use this flow. See `nodejs/expressmvc/routes/pades-signature-core.js` with
`public/javascripts/signature-start-form.js` and `signature-complete-form.js`:

1. The browser runs `pki.init({ ready: ..., ... })`, then `pki.listCertificates()`, then
   `pki.readCertificate(thumbprint)`, and posts the certificate's content to the server's
   **start** step.
2. The server prepares the signature for that document and certificate and gets back the
   **to-sign hash**, the **digest algorithm**, and state to carry to the next step. That state
   is:
   - Rest PKI Core: `state`
   - PKI Express: `transferFile`
   - PKI SDK: transfer data, which the server stores
3. The browser runs `pki.signHash({ thumbprint, hash, digestAlgorithm })` and posts the
   signature value.
4. The server's **complete** step finishes the signature with that state plus the signature
   value. It must use the same document and certificate as the start step.

**c. Rest PKI (v1) is different.** The server's `startWithWebPki()` returns a **token**: a
single-use string, not the API access token. The browser calls
`pki.signWithRestPki({ token, thumbprint })`, so Web PKI talks to Rest PKI directly. The server
then calls `finish()` (or `completeWithWebPki()` for authentication) with the token. A token
works for one attempt only, so get a new one to retry. Do not mix the flows: `signHash` does not
take a v1 token. `pades-signature-without-communication-rest-pki` shows a v1 variant in which
the browser never calls Rest PKI.

**d. Certificate authentication is a nonce challenge.** The server's start step issues a nonce.
Web PKI signs it with `pki.signData(...)`; the Rest PKI Core sample signs a hash instead. The
server's complete step validates the signature and the certificate. Never trust a certificate
the browser sent without that server-side check.

**e. Test certificates are accepted only in development.** Lacuna test certificates are
described at https://docs.lacunasoftware.com/articles/pki-guide/test-certs. The samples trust
them only in development, by switching to the *Lacuna Test* security context:

- .NET MVC: `#if DEBUG` in `Util.GetSecurityContextId()`
- .NET Core (`dotnet/spa`): the `PkiSuite:TrustLacunaTestRoot` flag, set only in
  `appsettings.Development.json` and read by `Util.GetSecurityContextId()` (Rest PKI Core) and
  `Util.GetTrustArbitrator()` (PKI SDK). It does not use `#if DEBUG`, so a Release build run in
  Development still trusts test certificates.
- elsewhere: `trustLacunaTestRoot` (or its equivalent), set in Java's `application-dev.yml`,
  Node.js's `config/default.js`, Flask's `DevelopmentConfig`, the `development` section of
  Rails' `lacuna.yml`, and PHP's `config.php`

Production must use the ICP-Brasil (PKI Brazil) context or your own. Some Rest PKI Core samples
hardcode a `securityContextId`, so check it before copying.

**f. Callbacks need a public URL.** The Rest PKI Core webhook and file-validation endpoints, and
the cloud-certificate OAuth return URLs, are called from outside. The samples point them at
localhost.

**g. PKI Express samples also use Rest PKI.** The shared `setPkiDefaults` helpers add the Rest
PKI timestamp authority, authenticated with the Rest PKI access token, to every PKI Express
operation. Timestamping with PKI Express needs that token.

**h. The Ruby `pki_express` gem needs a shim on Ruby 3.2 and later.** Versions up to 1.3.2 call
`File.exists?`, which Ruby 3.2 removed, so every operator setter that takes a file path raises
`NoMethodError`. The Rails sample aliases it back in
`ruby/rails/config/initializers/pki_express_ruby32_compat.rb`. A client app on Ruby 3.2+ needs the
same one-line initializer until a fixed gem ships. Do not put it in controller code.

## 6. Conventions for adding or changing a sample

- **Reuse slugs.** Name the task `<task>-<product>`, with `<product>` from the schema's enum,
  and use the same slug in every language. Check `SAMPLES.md` for an existing task name
  before inventing one.
- Follow the project's existing file naming and structure (controller, view, page script).
  The catalog maps the slug to the files, so they do not need to match.
- **Every sample needs a catalog entry** in `samples.json`, one per (language, framework).
  Then regenerate the markdown and validate. Validation must pass:

  ```bash
  python scripts/generate-samples-md.py
  python scripts/validate-catalog.py
  ```

  CI runs the same check on every pull request and push to `master`
  (`.github/workflows/validate-catalog.yml`).

- `.github/workflows/build-samples.yml` builds and starts each web project a pull request
  touches (all of them on `master` and weekly; never `dotnet/console`, whose tests run in
  `.github/workflows/test-console.yml`), and `scripts/ci/smoke-test.py` checks its home page and
  the catalog pages listed in that script's `SMOKE_SAMPLES`.

- Link new samples from the project's home `SampleRoutes` when the shared home app knows the
  key. In `dotnet/spa`, add them to `src/app/home/sample-list.ts` and `src/app/app.routes.ts`
  instead.
- Never commit real credentials. If a new config key holds a trial credential, add it to
  `update-licenses.ps1` and to the "For Devs" section of `README.md`.

## 7. Links

- Documentation (English): https://docs.lacunasoftware.com/en-us. Portuguese is the default at
  https://docs.lacunasoftware.com/. Each catalog entry's `docs_url` points to the relevant
  article.
- Demo site, with live versions of many of these tasks: https://try.lacunasoftware.com/en
- Test certificates: https://docs.lacunasoftware.com/articles/pki-guide/test-certs
- Signer workflow samples: https://github.com/LacunaSoftware/SignerSamples
- Client libraries used here:
  - NuGet: `Lacuna.Pki`, `Lacuna.RestPki.Client`, `Lacuna.RestPkiCore.Client`,
    `Lacuna.Cloudhub.Client`
  - Maven: `restpki-client`, `restpkicore-client`, `pki-express`, `amplia-client`,
    `cloudhub-client`, `signer-client`
  - npm: `restpki-client`, `restpki-core-client`, `pki-express`, `amplia-client`,
    `cloudhub-client`, and `web-pki` (the Web PKI library, in the `dotnet/spa` Angular app)
  - Packagist: `lacuna/restpki-client`, `lacuna/restpkicore-client`, `lacuna/pki-express`,
    `lacuna/amplia-client`, `lacuna/cloudhub-client`
  - PyPI: `restpki-client`, `restpki-ng-python-client` (Rest PKI Core), `pkiexpress`,
    `amplia-client`
  - RubyGems: `rest_pki`, `pki_express`. There is no Rest PKI Core gem: the Rails sample calls
    the API directly (`app/controllers/concerns/rest_pki_core_client.rb`)
