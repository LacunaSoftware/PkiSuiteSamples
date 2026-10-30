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

1. **Pick the certificate.** Run `"$APP" certs`. Each entry has `thumbprint`, `subjectName`, `cpf`, `issuerName` and `notAfter`. With one certificate, use it and name it to the user. With several, show them (subject, CPF, issuer, expiry) and ask which one. Done when you hold one thumbprint the user chose or accepted.

2. **List the pending documents.** Run `"$APP" list --cpf <cpf of that certificate>`. When the user says Signer knows them by email, run `"$APP" list --email <email>` instead. Show every document in `documents` as a numbered list: `name`, `folder`, `createdAt`. Done when the user has seen the whole list, or you told them it is empty and stopped.

3. **Get the confirmation.** Ask which documents to sign. Done when the user has named specific documents from that list, by number or name, or said "all of them" about that exact list. Map each one to its `id` from the `list` output.

4. **Sign.** Run `"$APP" sign --thumbprint <thumbprint> --id <id> --id <id> ...` with exactly the confirmed ids. Add `--email <email>` when the documents were listed by email. A smart card or token may show a PIN prompt on screen: tell the user to watch for it.

5. **Report.** From `results`, tell the user which documents were `signed` and which `failed`, with each failure's `error.message`. Done when every confirmed document is accounted for. To retry a failed one, ask the user first.

## Reading the output

Results go to stdout as JSON; errors go to stderr as `{"error":{"code","message"}}`.

| Exit | Meaning | What to do |
|---|---|---|
| 0 | Success | Continue |
| 1 | `sign` ran, some documents failed | Report each `results[].error` |
| 2 | Invalid arguments (`InvalidCpf`, `InvalidEmail`, ...) | Fix the command or ask the user |
| 3 | Configuration (`MissingSignerApiKey`, `InvalidPkiSdkLicense`) | Tell the user to configure the app: its README says how |
| 4 | Certificate (`CertificateNotFound`, `UnsupportedPlatform`) | Run `certs` again and ask the user |
| 5 | Signer error (Signer's own code, or `SignerUnavailable`) | Show the message to the user |

Codes that mean the document cannot be signed as asked: `NotPending` (signed, refused or not the user's turn yet), `CpfMismatch` (the certificate's CPF is not the participant's).
