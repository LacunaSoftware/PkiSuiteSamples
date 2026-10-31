# A .NET console project signs pending Signer documents, called by an agent skill

Status: accepted (2026-10-30)

Every other project in this repo is a web app, and Signer workflow samples usually live in [SignerSamples](https://github.com/LacunaSoftware/SignerSamples). The Skill-friendly signature app breaks both habits on purpose. It is a .NET 10 console project in `dotnet/console/SkillFriendlySignatureApp`. It lists a participant's pending documents on Signer (DropSigner by default) and signs them with a certificate from the current user's Windows certificate store. A Claude Code skill shipped next to it calls it.

**Why a console, here.** Here, the user signing is driven by a coding agent, not by a browser. An agent calls commands and reads their output, so the app is a non-interactive CLI: JSON on stdout, JSON errors on stderr, a distinct exit code per failure class, and no prompts. It lives in this repo rather than SignerSamples because the catalog (`samples.json`) is how agents find samples, and because it uses PKI SDK, a PKI Suite product, for the certificate store and the hash signature.

**Why the private key stays put.** The app runs on the signer's own machine, so the private key never leaves it (AGENTS.md 5a). Signer computes the to-sign hash, PKI SDK signs it locally, and Signer completes the signature. It uses Signer's public-signature flow (action URL, then key and ticket), the same one the Java `batch-pades-signature-signer` sample uses, because an organization API key cannot sign as the participant (a Signer user).

**Why an agent cannot sign on its own.** A signature is legally binding. `sign` takes explicit document ids and has no "sign everything" option, and the skill requires the user's explicit confirmation of the listed documents before it calls `sign`. The Signer API key is read from configuration or the environment, never from a command-line flag, so it never appears in the agent's commands.

## Consequences

- The catalog schema gains a `console` framework, and `run.url` is null for it (the schema allows null).
- `build-samples.yml` leaves the project out: it starts each web app and smoke-tests its URL, which a console app does not have. Its own workflow, `test-console.yml`, runs the unit and command-line contract tests, which use an in-memory Signer and a PFX. The live tests need a Signer sandbox API key and a certificate in the Windows store, which CI has neither of, so they run only on a developer's machine.
- The certificate store is the Windows one (PKI SDK `WindowsCertificateStore`), so `certs` and `sign` run on Windows only.
