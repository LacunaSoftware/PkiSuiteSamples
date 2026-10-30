using System.CommandLine;
using System.Security.Cryptography;
using Lacuna.Pki;
using Lacuna.Signer.Api.Documents;
using Lacuna.Signer.Api.Signature;
using SkillFriendlySignatureApp.Certificates;
using SkillFriendlySignatureApp.Signer;

namespace SkillFriendlySignatureApp.Commands;

/// <summary>
/// `sign --thumbprint <t> --id <document id> [--id ...] [--email <e>]`: signs the given pending
/// documents with a certificate from the Windows store.
///
/// The private key never leaves this machine. For each document:
///   1. Signer returns the participant's action URL, which carries the public signature "key" and
///      "ticket" (POST /api/documents/{id}/action-url). The app's API key may not sign as a
///      Signer user, so it uses the public signature flow, like the Java
///      batch-pades-signature-signer sample.
///   2. Signer prepares the signature for the certificate and returns the to-sign hash, its
///      digest algorithm and a token (StartPublicSignatureAsync).
///   3. PKI SDK signs the hash with the certificate's private key, here.
///   4. Signer completes the signature with the signature value and the token
///      (CompletePublicSignatureAsync).
///
/// The participant's CPF comes from the certificate, because Signer refuses a certificate whose
/// CPF is not the participant's (CpfMismatch). --email is for a participant that Signer knows by
/// email only. A failure on one document does not stop the others: the result lists each one.
/// </summary>
public static class SignCommand {

	public static Command Create(CliServices services) {
		var thumbprintOption = new Option<string>("--thumbprint") {
			Description = "SHA-1 thumbprint of the certificate, as `certs` prints it.",
			Required = true,
		};
		var idOption = new Option<Guid[]>("--id") {
			Description = "Id of a pending document, as `list` prints it. Repeat for several documents.",
			Required = true,
			Arity = ArgumentArity.OneOrMore,
			// Report a malformed id as a parse error, before anything calls Signer.
			CustomParser = result => {
				var ids = new List<Guid>();
				foreach (var token in result.Tokens) {
					if (Guid.TryParse(token.Value, out var id)) {
						ids.Add(id);
					} else {
						result.AddError($"'{token.Value}' is not a document id.");
					}
				}
				return ids.ToArray();
			},
		};
		var emailOption = new Option<string>("--email") {
			Description = "The participant's email address, for a participant Signer knows by email only.",
		};

		var command = new Command("sign", "Signs the given pending documents with a certificate. The participant is the certificate's CPF (and --email, if given).") {
			thumbprintOption,
			idOption,
			emailOption,
		};

		command.SetAction((parseResult, cancellationToken) => Cli.RunCommandAsync(services, async () => {
			var email = parseResult.GetValue(emailOption) is { } e ? Participant.ParseEmail(e) : null;
			var signer = services.CreateSignerGateway();
			var certificate = LocalCertificates.Find(services.CreateCertificateSource(), parseResult.GetRequiredValue(thumbprintOption), services.Time.GetUtcNow());
			var participant = new Participant(certificate.Cpf, email);

			var results = new List<SignResult>();
			foreach (var documentId in parseResult.GetRequiredValue(idOption).Distinct()) {
				cancellationToken.ThrowIfCancellationRequested();
				results.Add(await SignDocumentAsync(signer, certificate, participant, documentId));
			}

			var failedCount = results.Count(r => r.Status == SignResult.Failed);
			object result = new {
				certificate = new { thumbprint = certificate.Thumbprint, cpf = certificate.Cpf },
				signedCount = results.Count - failedCount,
				failedCount,
				results,
			};
			return (result, failedCount > 0 ? ExitCodes.SomeDocumentsFailed : ExitCodes.Success);
		}));
		return command;
	}

	private static async Task<SignResult> SignDocumentAsync(ISignerGateway signer, LocalCertificate certificate, Participant participant, Guid documentId) {
		string? name = null;
		try {
			// Check again that the document is pending for this participant: it may have changed
			// since `list`, and the action URL needs the flow action and the user's email.
			var document = await signer.GetDocumentDetailsAsync(documentId);
			name = document.Name;
			var pending = PendingDocuments.FindPendingAction(document, participant)
				?? throw new AppException(ErrorCodes.NotPending, "The document is not pending signature for this participant.", ExitCodes.SomeDocumentsFailed);

			// 1. The action URL, with the public signature key and ticket.
			var actionUrl = await signer.GetActionUrlAsync(documentId, new ActionUrlRequest {
				Identifier = participant.Cpf,
				EmailAddress = participant.Email ?? pending.Email,
				FlowActionId = pending.Action.Id,
			});
			var link = PublicSignatureLink.Parse(actionUrl);

			// 2. Signer computes the hash to sign for this certificate (public part only).
			var start = await signer.StartPublicSignatureAsync(link.Key, new PublicStartSignatureRequest {
				Certificate = certificate.Certificate.EncodedValue,
				Ticket = link.Ticket,
			});
			if (!start.Success) {
				throw new AppException(ErrorCodes.CertificateRejected, "Signer did not accept the certificate for this signature.", ExitCodes.SomeDocumentsFailed);
			}

			// 3. Sign the hash with the private key, on this machine.
			var signature = certificate.SignHash(ParseDigestAlgorithm(start.DigestAlgorithm), start.ToSignHash);

			// 4. Signer applies the signature to the document.
			await signer.CompletePublicSignatureAsync(link.Key, new CompleteSignatureRequest {
				Signature = signature,
				Token = start.Token,
			});
			return new SignResult(documentId, name, SignResult.Signed, null);

		} catch (Exception ex) when (ex is not OperationCanceledException) {
			var (code, message, _) = Cli.Describe(ex);
			return new SignResult(documentId, name, SignResult.Failed, new SignError(code, message));
		}
	}

	/// <summary>
	/// Signer returns the digest algorithm as an OID (2.16.840.1.101.3.4.2.1) or as a name
	/// (SHA256, SHA-256), depending on the version.
	/// </summary>
	public static DigestAlgorithm ParseDigestAlgorithm(string? value) {
		value = value?.Trim() ?? "";
		if (DigestAlgorithm.TryGetInstanceByOid(value, out var algorithm)
			|| DigestAlgorithm.TryGetInstanceByName(value, out algorithm)
			|| DigestAlgorithm.TryGetInstanceByHashAlgorithmName(new HashAlgorithmName(value.Replace("-", "").ToUpperInvariant()), out algorithm)) {
			return algorithm;
		}
		throw new AppException(ErrorCodes.UnsupportedDigestAlgorithm, $"Signer asked for an unknown digest algorithm: '{value}'.", ExitCodes.SomeDocumentsFailed);
	}
}

public record SignError(string Code, string Message);

/// <summary>
/// The outcome of one document: "signed", or "failed" with the error.
/// </summary>
public record SignResult(Guid DocumentId, string? Name, string Status, SignError? Error) {
	public const string Signed = "signed";
	public const string Failed = "failed";
}
