---
name: sign-pending-documents
description: Lists and signs the user's documents pending signature on Lacuna Signer (DropSigner) with a certificate from their Windows store. Use when the user asks what they have to sign, or asks to sign their pending documents.
---

# Sign pending documents

You drive the Skill-friendly signature app, a CLI that prints JSON. A signature is legally binding: you list, the user chooses, and you sign exactly the documents the user confirmed.

The app (edit this path once, after `dotnet publish`):

```
APP="C:/Tools/SkillFriendlySignatureApp/SkillFriendlySignatureApp.exe"
```

Its Signer API key comes from its own configuration. Run it with the commands below and nothing else.

## Steps

1. **Pick the certificate.** Run `"$APP" certs`. Each entry has `thumbprint`, `subjectName`, `cpf`, `issuerName` and `notAfter`. With one certificate, use it and name it to the user. With several, show them (subject, CPF, issuer, expiry) and ask which one. With none, tell the user that no usable certificate is installed (it needs a private key, a CPF, and to be valid now), and stop. Done when you hold one thumbprint the user chose or accepted.

2. **List the pending documents.** Run `"$APP" list --cpf <cpf of that certificate>`. When the user says Signer knows them by email, run `"$APP" list --email <email>` instead. Show every document in `documents` as a numbered list: `name`, `folder` (absent when the document has none), `createdAt`. Done when the user has seen the whole list, or you told them it is empty and stopped.

3. **Get the confirmation.** Ask which documents to sign. Done when the user has named specific documents from that list, by number or name, or said "all of them" about that exact list. Map each one to its `id` from the `list` output.

4. **Sign.** Run `"$APP" sign --thumbprint <thumbprint> --id <id> --id <id> ...` with exactly the confirmed ids. Add `--email <email>` when the documents were listed by email. A smart card or token may show a PIN prompt on screen: tell the user to watch for it.

5. **Report.** Every document in `results` has a `status`. Tell the user which ones are:
   - `signed`;
   - `failed`, with the `error.message`;
   - `unknown`: Signer got the signature but did not answer, so it may be signed. Run `list` again: a document that is no longer pending was signed;
   - `notAttempted`, with the `error.message`: the run stopped before it, after Ctrl+C or after an error that every document would hit.

   Done when every confirmed document is accounted for. To retry a document, ask the user first.

If `sign` ends in any other way (no JSON on stdout, or your tool killed it on a timeout), some documents may be signed already. Run `list` again and tell the user which confirmed documents are no longer pending, before you retry anything.

## Reading the output

Results go to stdout as JSON; errors go to stderr as `{"error":{"code","message"}}`.

| Exit | Meaning | What to do |
|---|---|---|
| 0 | Success | Continue |
| 1 | `sign` ran, and not every document was signed. `sign` reports Signer errors per document, so it never exits 5 | Report each result that is not `signed` |
| 2 | Invalid arguments (`InvalidCpf`, `InvalidEmail`, ...) | Fix the command or ask the user |
| 3 | Configuration (`MissingSignerApiKey`, `InvalidSignerApiKey`, `InvalidSignerEndpoint`, `MissingPkiSdkLicense`, `InvalidPkiSdkLicense`) | Tell the user to configure the app: its README says how |
| 4 | Certificate: `CertificateNotFound` | Run `certs` again and ask the user |
| 4 | Certificate: `UnsupportedPlatform` | Tell the user the app needs Windows, and stop |
| 5 | Signer error from `list` (Signer's own code, `SignerError`, or `SignerUnavailable`) | Show the message to the user |
| 6 | Canceled (Ctrl+C). `sign` still prints its results | Report the results as in step 5 |
| 10 | Unexpected error (`Unexpected`) | Show the message to the user, and stop |
| other | The process was ended without reporting | Run `list` again before retrying anything |

Codes that mean the document cannot be signed as asked:
- `NotPending`: already signed or refused, no longer pending, not the user's turn yet, or not this participant's.
- `DocumentNotFound`: no such document.
- `CpfMismatch`: the certificate's CPF is not the participant's.
- `CertificateRejected` or `SignatureRejected`: Signer refused the certificate or the signature. The message says why.
- `PrivateKeyUnavailable`: the PIN was wrong or canceled, or the token was removed. Ask the user before retrying: a smart card locks after a few wrong PINs.
