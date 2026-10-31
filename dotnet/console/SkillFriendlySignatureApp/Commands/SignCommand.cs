using System.CommandLine;
using System.Security.Cryptography;
using Lacuna.Pki;
using Lacuna.RestClient;
using Lacuna.Signer.Api;
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
///   0. Signer returns the document's details (GET /api/documents/{id}), and the app checks that
///      it is still pending for the participant.
///   1. Signer returns the participant's action URL, which carries the public signature "key" and
///      "ticket" (POST /api/documents/{id}/action-url). An organization API key cannot sign as a
///      Signer user, so the app uses the public signature flow, like the Java
///      batch-pades-signature-signer sample.
///   2. Signer prepares the signature for the certificate and returns the to-sign hash, its
///      digest algorithm and a token (StartPublicSignatureAsync).
///   3. PKI SDK signs the hash with the certificate's private key, here.
///   4. Signer completes the signature with the signature value and the token
///      (CompletePublicSignatureAsync).
///
/// The participant's CPF comes from the certificate, because Signer refuses a certificate whose
/// CPF is not the participant's (CpfMismatch). --email is for a participant that Signer knows by
/// email only.
///
/// A signature cannot be undone, so the result accounts for every document: "signed", "failed",
/// "unknown" (step 4 got no answer, and Signer could not say whether it applied the signature) or
/// "notAttempted". A failure on one document does not stop the others, except one that would
/// fail them all (a refused API key, an unusable private key), which could lock a smart card
/// after a few wrong PINs. Ctrl+C stops between documents, never in the middle of one.
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
			SignError? stopReason = null;
			foreach (var documentId in parseResult.GetRequiredValue(idOption).Distinct()) {
				if (stopReason == null && cancellationToken.IsCancellationRequested) {
					stopReason = new SignError(ErrorCodes.Canceled, "The command was canceled before this document.");
				}
				if (stopReason != null) {
					results.Add(new SignResult(documentId, null, SignResult.NotAttempted, stopReason));
					continue;
				}
				var (result, stopsBatch) = await SignDocumentAsync(signer, certificate, participant, documentId);
				results.Add(result);
				if (stopsBatch) {
					stopReason = new SignError(result.Error!.Code, $"Not attempted after an error that would fail every document: {result.Error.Message}");
				}
			}

			var signedCount = results.Count(r => r.Status == SignResult.Signed);
			object output = new {
				certificate = new { thumbprint = certificate.Thumbprint, cpf = certificate.Cpf },
				signedCount,
				failedCount = results.Count(r => r.Status == SignResult.Failed),
				unknownCount = results.Count(r => r.Status == SignResult.Unknown),
				notAttemptedCount = results.Count(r => r.Status == SignResult.NotAttempted),
				results,
			};
			var exitCode = cancellationToken.IsCancellationRequested ? ExitCodes.Canceled
				: signedCount == results.Count ? ExitCodes.Success
				: ExitCodes.SomeDocumentsFailed;
			return (output, exitCode);
		}));
		return command;
	}

	/// <summary>
	/// Signs one document. Never throws: every error becomes the document's result. StopsBatch is
	/// true for an error that the next documents would hit too.
	/// </summary>
	private static async Task<(SignResult Result, bool StopsBatch)> SignDocumentAsync(ISignerGateway signer, LocalCertificate certificate, Participant participant, Guid documentId) {
		string? name = null;
		Guid flowActionId = default;
		var completeSent = false;
		try {
			// 0. Check again that the document is pending for this participant: it may have changed
			// since `list`, and the action URL needs the flow action and the user's email.
			var document = await signer.GetDocumentDetailsAsync(documentId);
			name = document.Name;
			var pending = PendingDocuments.FindPendingAction(document, participant)
				?? throw new AppException(ErrorCodes.NotPending, "The document is not pending signature for this participant.", ExitCodes.Signer);
			flowActionId = pending.Action.Id;

			// 1. The action URL, with the public signature key and ticket.
			var actionUrl = await signer.GetActionUrlAsync(documentId, new ActionUrlRequest {
				Identifier = participant.Cpf,
				EmailAddress = participant.Email ?? pending.Email,
				FlowActionId = flowActionId,
			});
			var link = PublicSignatureLink.Parse(actionUrl);

			// 2. Signer computes the hash to sign for this certificate (public part only).
			var start = await signer.StartPublicSignatureAsync(link.Key, new PublicStartSignatureRequest {
				Certificate = certificate.Certificate.EncodedValue,
				Ticket = link.Ticket,
			});
			if (!start.Success) {
				throw new AppException(ErrorCodes.CertificateRejected, $"Signer did not accept the certificate for this signature{Summarize(start.ValidationResults)}", ExitCodes.Signer);
			}

			// 3. Sign the hash with the private key, on this machine.
			var signature = SignHash(certificate, ParseDigestAlgorithm(start.DigestAlgorithm), start.ToSignHash);

			// 4. Signer applies the signature to the document.
			completeSent = true;
			var complete = await signer.CompletePublicSignatureAsync(link.Key, new CompleteSignatureRequest {
				Signature = signature,
				Token = start.Token,
			});
			if (!complete.Success) {
				throw new AppException(ErrorCodes.SignatureRejected, $"Signer did not accept the signature{Summarize(complete.ValidationResults)}", ExitCodes.Signer);
			}
			return (new SignResult(documentId, name, SignResult.Signed, null), false);

		} catch (Exception ex) when (completeSent && IsUnanswered(ex)) {
			// The request may have reached Signer before the connection failed.
			return (await CheckOutcomeAsync(signer, participant, documentId, name, flowActionId, ex), false);

		} catch (Exception ex) {
			var (code, message, exitCode) = Cli.Describe(ex);
			var stopsBatch = exitCode is ExitCodes.Configuration or ExitCodes.Certificate;
			return (new SignResult(documentId, name, SignResult.Failed, new SignError(code, message)), stopsBatch);
		}
	}

	private static byte[] SignHash(LocalCertificate certificate, DigestAlgorithm digestAlgorithm, byte[] hash) {
		try {
			return certificate.SignHash(digestAlgorithm, hash);
		} catch (Exception ex) {
			// A wrong or canceled PIN, or a token that was removed.
			throw new AppException(ErrorCodes.PrivateKeyUnavailable, $"Could not sign with the certificate's private key: {ex.Message}", ExitCodes.Certificate);
		}
	}

	/// <summary>
	/// Whether Signer gave no answer to a request: it was unreachable, timed out, or failed on its
	/// side.
	/// </summary>
	private static bool IsUnanswered(Exception ex)
		=> ex is RestUnreachableException || ex is RestErrorException { StatusCode: >= System.Net.HttpStatusCode.InternalServerError };

	/// <summary>
	/// After step 4 got no answer, asks Signer whether it applied the signature: "signed" if the
	/// participant's action is now signed, "unknown" otherwise.
	/// </summary>
	private static async Task<SignResult> CheckOutcomeAsync(ISignerGateway signer, Participant participant, Guid documentId, string? name, Guid flowActionId, Exception error) {
		var (_, message, _) = Cli.Describe(error);
		string check;
		try {
			var document = await signer.GetDocumentDetailsAsync(documentId);
			if (PendingDocuments.HasSigned(document, flowActionId, participant)) {
				return new SignResult(documentId, name, SignResult.Signed, null);
			}
			check = "Signer has not recorded the signature yet";
		} catch (Exception ex) {
			check = $"the check failed too ({Cli.Describe(ex).Message})";
		}
		return new SignResult(documentId, name, SignResult.Unknown, new SignError(ErrorCodes.OutcomeUnknown,
			$"Signer did not answer the last step ({message}), and {check}. Run `list` again before retrying: the document is signed if it is no longer pending."));
	}

	/// <summary>
	/// ": error; error." from Signer's validation errors, or "." when there are none.
	/// </summary>
	private static string Summarize(ValidationResultsModel? validation) {
		var errors = validation?.Errors?.Select(e => e.Message).Where(m => !string.IsNullOrWhiteSpace(m)).ToList();
		return errors is { Count: > 0 } ? $": {string.Join("; ", errors)}." : ".";
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
		throw new AppException(ErrorCodes.UnsupportedDigestAlgorithm, $"Signer asked for an unknown digest algorithm: '{value}'.", ExitCodes.Signer);
	}
}

public record SignError(string Code, string Message);

/// <summary>
/// The outcome of one document: "signed", or "failed", "unknown" or "notAttempted" with the error.
/// </summary>
public record SignResult(Guid DocumentId, string? Name, string Status, SignError? Error) {
	public const string Signed = "signed";
	public const string Failed = "failed";
	public const string Unknown = "unknown";
	public const string NotAttempted = "notAttempted";
}
