# Skill-friendly signature app (.NET 10 console)

A command-line app that lists the documents pending signature for a participant on **Lacuna
Signer** (DropSigner by default) and signs them with a certificate from the Windows certificate
store, through **PKI SDK**. It is built to be called by a coding agent: it prints JSON, never
prompts, and ships a Claude Code skill ([`skill/SKILL.md`](skill/SKILL.md)) that drives it.

It differs from the other projects in this repository: it is a console app (no URL), CI does not
build it, and it runs on Windows only. See
[ADR 0002](../../../docs/adr/0002-console-project-for-agent-driven-signing.md).

## Samples in this project

Every row is an entry in the repository catalog ([samples.json](../../../samples.json),
[SAMPLES.md](../../../SAMPLES.md)).

<!-- BEGIN GENERATED SAMPLES LIST (project: dotnet/console/SkillFriendlySignatureApp) -->
| Sample | Product | Entry file | Open |
|---|---|---|---|
| Sign your pending Signer documents from a Claude Code skill<br>`sign-pending-documents-signer` | Signer | [SignCommand.cs](Commands/SignCommand.cs) | (console) |
<!-- END GENERATED SAMPLES LIST -->

## How it signs

The private key never leaves the machine. For each document, `sign`:

1. gets the participant's action URL from Signer, which carries a public signature key and
   ticket (an organization API key cannot sign as a Signer user);
2. starts the signature on Signer with the certificate, which returns the hash to sign;
3. signs that hash with the private key, locally, through PKI SDK;
4. completes the signature on Signer.

The participant's CPF comes from the certificate, because Signer refuses a certificate whose CPF
is not the participant's (`CpfMismatch`). A **pending document** is one the participant can sign
with a certificate right now: approvals, and steps whose turn has not come yet, are left out.

## Configure

Requires Windows and the .NET 10 SDK. Settings are read from `appsettings.json`, then user
secrets, then environment variables (`Signer__ApiKey`). Every key is documented in
[`appsettings.json.example`](appsettings.json.example).

- **Signer API key** (required for `list` and `sign`): create an application on your Signer
  organization and keep its key out of the repository:

  ```bash
  dotnet user-secrets set Signer:ApiKey "<app name>|<key>"
  ```

- **Signer endpoint**: `Signer:Endpoint`, `https://www.dropsigner.com` by default. The sandbox is
  `https://signer-lac.azurewebsites.net`. An API key works only on the instance that issued it.
- **PKI SDK license**: `PkiSdk:License` (or `PkiSdk__License`) with a Base64 license. Without
  it, the app loads the trial `LacunaPkiLicense.config` next to the executable.

Pass none of these as command-line flags: an agent that runs the app would see them.

## Run

```bash
dotnet run -- certs
dotnet run -- list --cpf 560.723.861-05
dotnet run -- sign --thumbprint <thumbprint> --id <document id> --id <document id>
dotnet run -- --help
```

| Command | Prints |
|---|---|
| `certs` | Certificates in `CurrentUser\My` with a private key, valid now, carrying a CPF |
| `list --cpf <cpf>` / `list --email <email>` | The participant's pending documents, with their ids |
| `sign --thumbprint <t> --id <id>... [--email <e>]` | One result per document: `signed`, or `failed` with the error |

Errors go to stderr as `{"error":{"code","message"}}`. Exit codes: 0 success, 1 some documents
failed, 2 invalid arguments, 3 configuration, 4 certificate, 5 Signer error.

## Use it from Claude Code

1. Publish the app once, so the skill calls an executable instead of rebuilding on every call:

   ```bash
   dotnet publish -c Release -o C:/Tools/SkillFriendlySignatureApp
   ```

2. Copy `skill/` to `.claude/skills/sign-pending-documents/` in your project (or to
   `~/.claude/skills/sign-pending-documents/` for every project).
3. Edit the `APP=` line at the top of the copied `SKILL.md` if you published elsewhere.
4. Ask Claude "what do I have to sign on DropSigner?". The skill lists your documents and signs
   only the ones you confirm.

## Tests

```bash
cd ..
dotnet test --solution SkillFriendlySignatureApp.slnx
```

The unit and command-line contract tests use an in-memory Signer and `Pierre de Fermat.pfx`.
`LiveSandboxTests` run against the Signer sandbox only when `Signer__ApiKey` holds a sandbox API
key and the Windows store has a Lacuna test certificate (issued by *Lacuna CA Test v7*, with a
CPF), or `SkillSignatureTests__Thumbprint` names one. They create documents there and leave them.
