using System.Net;
using System.Text.Json;
using Lacuna.Pki;
using SkillFriendlySignatureApp.Tests.TestSupport;
using static SkillFriendlySignatureApp.Tests.TestSupport.FakeSignerGateway;
using SignerErrorCodes = Lacuna.Signer.Api.ErrorCodes;

namespace SkillFriendlySignatureApp.Tests;

/// <summary>
/// The contract the skill relies on: JSON on stdout, a JSON error on stderr, and the exit code.
/// </summary>
public class CliContractTests {

	private const string Cpf = TestCertificates.PierreCpf;

	private static string PierreThumbprint => Convert.ToHexString(TestCertificates.LoadPierre().Certificate.ThumbprintSHA1);

	[Fact]
	public async Task Certs_lists_the_usable_certificates() {
		var run = await CliRunner.RunAsync(["certs"]);

		Assert.Equal(ExitCodes.Success, run.ExitCode);
		Assert.Empty(run.Error);
		var certificate = Assert.Single(run.Json.GetProperty("certificates").EnumerateArray());
		Assert.Equal(PierreThumbprint, certificate.GetProperty("thumbprint").GetString());
		Assert.Equal(Cpf, certificate.GetProperty("cpf").GetString());
		Assert.Equal("Pierre de Fermat", certificate.GetProperty("subjectName").GetString());
	}

	[Fact]
	public async Task List_prints_only_the_pending_documents() {
		var signer = new FakeSignerGateway();
		var pending = signer.Add(Document("Contract", SignerAction(Cpf, null)));
		signer.Add(Document("Approval", ApproverAction(Cpf, null)));

		var run = await CliRunner.RunAsync(["list", "--cpf", "473.633.618-86"], signer);

		Assert.Equal(ExitCodes.Success, run.ExitCode);
		Assert.Equal(Cpf, run.Json.GetProperty("participant").GetProperty("cpf").GetString());
		Assert.Equal(1, run.Json.GetProperty("totalCount").GetInt32());
		var document = Assert.Single(run.Json.GetProperty("documents").EnumerateArray());
		Assert.Equal(pending.Id, document.GetProperty("id").GetGuid());
		Assert.Equal("Contract", document.GetProperty("name").GetString());
		Assert.Equal(pending.CreationDate, document.GetProperty("createdAt").GetDateTimeOffset());
		Assert.Equal(pending.FlowActions[0].Id, document.GetProperty("flowActionId").GetGuid());
		Assert.Equal("Signer", document.GetProperty("actionType").GetString());
		Assert.Equal("Contracts", document.GetProperty("folder").GetString());
	}

	[Theory]
	[InlineData(new[] { "list" }, ErrorCodes.InvalidArguments)]
	[InlineData(new[] { "list", "--cpf", Cpf, "--email", "pierre@example.com" }, ErrorCodes.InvalidArguments)]
	[InlineData(new[] { "list", "--cpf", "47363361887" }, ErrorCodes.InvalidCpf)]
	[InlineData(new[] { "list", "--email", "pierre" }, ErrorCodes.InvalidEmail)]
	[InlineData(new[] { "list", "--nope" }, ErrorCodes.InvalidArguments)]
	[InlineData(new[] { "sign", "--thumbprint", "AB" }, ErrorCodes.InvalidArguments)]
	[InlineData(new[] { "sign", "--thumbprint", "AB", "--id", "not-a-guid" }, ErrorCodes.InvalidArguments)]
	[InlineData(new string[0], ErrorCodes.InvalidArguments)]
	public async Task Invalid_arguments_are_a_json_error_with_exit_code_2(string[] args, string code) {
		var run = await CliRunner.RunAsync(args, new FakeSignerGateway());

		Assert.Equal(ExitCodes.InvalidArguments, run.ExitCode);
		Assert.Empty(run.Output);
		Assert.Equal(code, run.ErrorCode);
	}

	[Fact]
	public async Task Without_an_api_key_list_is_a_configuration_error() {
		var run = await CliRunner.RunAsync(["list", "--cpf", Cpf]);

		Assert.Equal(ExitCodes.Configuration, run.ExitCode);
		Assert.Equal(ErrorCodes.MissingSignerApiKey, run.ErrorCode);
	}

	[Fact]
	public async Task A_signer_error_keeps_signers_code() {
		var signer = new FakeSignerGateway { ListError = ApiError(SignerErrorCodes.ApplicationKeyNotFound, "Invalid API key.") };

		var run = await CliRunner.RunAsync(["list", "--cpf", Cpf], signer);

		Assert.Equal(ExitCodes.Signer, run.ExitCode);
		Assert.Equal("ApplicationKeyNotFound", run.ErrorCode);
	}

	[Fact]
	public async Task Sign_signs_the_hash_with_the_certificate_and_completes_the_signature() {
		var signer = new FakeSignerGateway();
		var document = signer.Add(Document("Contract", SignerAction(Cpf, "pierre@example.com")));

		var run = await CliRunner.RunAsync(["sign", "--thumbprint", PierreThumbprint, "--id", document.Id.ToString()], signer);

		Assert.Equal(ExitCodes.Success, run.ExitCode);
		Assert.Equal(1, run.Json.GetProperty("signedCount").GetInt32());
		var result = Assert.Single(run.Json.GetProperty("results").EnumerateArray());
		Assert.Equal("signed", result.GetProperty("status").GetString());

		// The action URL is asked for the certificate's CPF and the action found in the details.
		var (_, request) = Assert.Single(signer.ActionUrlRequests);
		Assert.Equal(Cpf, request.Identifier);
		Assert.Equal("pierre@example.com", request.EmailAddress);
		Assert.Equal(document.FlowActions[0].Id, request.FlowActionId);

		// Signer received the certificate, and a valid signature of the hash it asked for.
		var key = $"key-{document.Id}";
		var pierre = TestCertificates.LoadPierre();
		Assert.Equal(pierre.Certificate.EncodedValue, signer.Started[key].Certificate);
		Assert.True(pierre.VerifyHash(DigestAlgorithm.GetInstanceByOid(Sha256Oid), signer.Started[key].ToSignHash, signer.Completed[key]));
	}

	[Fact]
	public async Task Sign_reports_each_document_and_goes_on_after_a_failure() {
		var signer = new FakeSignerGateway { DigestAlgorithm = "SHA256" };
		var notPending = signer.Add(Document("Approval", ApproverAction(Cpf, null)));
		var rejected = signer.Add(Document("Rejected", SignerAction(Cpf, null)));
		var signed = signer.Add(Document("Contract", SignerAction(Cpf, null)));
		signer.StartErrors[rejected.Id] = ApiError(SignerErrorCodes.CpfMismatch, "The certificate's CPF is not the signer's.");
		var unknown = Guid.NewGuid();

		var run = await CliRunner.RunAsync(["sign", "--thumbprint", PierreThumbprint, "--id", notPending.Id.ToString(), "--id", rejected.Id.ToString(), "--id", unknown.ToString(), "--id", signed.Id.ToString()], signer);

		Assert.Equal(ExitCodes.SomeDocumentsFailed, run.ExitCode);
		Assert.Empty(run.Error);
		Assert.Equal(1, run.Json.GetProperty("signedCount").GetInt32());
		Assert.Equal(3, run.Json.GetProperty("failedCount").GetInt32());
		var results = run.Json.GetProperty("results").EnumerateArray().ToDictionary(r => r.GetProperty("documentId").GetGuid());
		Assert.Equal(ErrorCodes.NotPending, ErrorCodeOf(results[notPending.Id]));
		Assert.Equal("CpfMismatch", ErrorCodeOf(results[rejected.Id]));
		Assert.Equal("DocumentNotFound", ErrorCodeOf(results[unknown]));
		Assert.Equal("signed", results[signed.Id].GetProperty("status").GetString());
		Assert.Equal("Contract", results[signed.Id].GetProperty("name").GetString());
	}

	[Fact]
	public async Task Sign_with_an_unknown_certificate_signs_nothing() {
		var signer = new FakeSignerGateway();
		var document = signer.Add(Document("Contract", SignerAction(Cpf, null)));

		var run = await CliRunner.RunAsync(["sign", "--thumbprint", "0000", "--id", document.Id.ToString()], signer);

		Assert.Equal(ExitCodes.Certificate, run.ExitCode);
		Assert.Equal(ErrorCodes.CertificateNotFound, run.ErrorCode);
		Assert.Empty(signer.ActionUrlRequests);
	}

	[Theory]
	[InlineData(401, ErrorCodes.InvalidSignerApiKey, ExitCodes.Configuration)]
	[InlineData(500, ErrorCodes.SignerError, ExitCodes.Signer)]
	[InlineData(0, ErrorCodes.SignerUnavailable, ExitCodes.Signer)]
	public async Task Http_errors_from_signer_are_told_apart(int statusCode, string code, int exitCode) {
		var signer = new FakeSignerGateway { ListError = statusCode == 0 ? Unreachable() : HttpError((HttpStatusCode)statusCode) };

		var run = await CliRunner.RunAsync(["list", "--cpf", Cpf], signer);

		Assert.Equal(exitCode, run.ExitCode);
		Assert.Equal(code, run.ErrorCode);
	}

	[Fact]
	public async Task Sign_reports_a_certificate_or_signature_that_signer_refused_as_failed() {
		var signer = new FakeSignerGateway();
		var certificateRefused = signer.Add(Document("Certificate refused", SignerAction(Cpf, null)));
		var signatureRefused = signer.Add(Document("Signature refused", SignerAction(Cpf, null)));
		var signed = signer.Add(Document("Contract", SignerAction(Cpf, null)));
		signer.RejectedStarts[certificateRefused.Id] = "The certificate is revoked";
		signer.RejectedCompletions[signatureRefused.Id] = "The signature does not match the policy";

		var run = await CliRunner.RunAsync(["sign", "--thumbprint", PierreThumbprint, "--id", certificateRefused.Id.ToString(), "--id", signatureRefused.Id.ToString(), "--id", signed.Id.ToString()], signer);

		Assert.Equal(ExitCodes.SomeDocumentsFailed, run.ExitCode);
		var results = ResultsById(run);
		Assert.Equal(ErrorCodes.CertificateRejected, CodeOf(results[certificateRefused.Id], "failed"));
		Assert.Contains("The certificate is revoked", results[certificateRefused.Id].GetProperty("error").GetProperty("message").GetString());
		Assert.Equal(ErrorCodes.SignatureRejected, CodeOf(results[signatureRefused.Id], "failed"));
		Assert.Contains("does not match the policy", results[signatureRefused.Id].GetProperty("error").GetProperty("message").GetString());
		Assert.Equal("signed", results[signed.Id].GetProperty("status").GetString());
		Assert.False(results[signed.Id].TryGetProperty("error", out _));
		Assert.Equal(1, run.Json.GetProperty("signedCount").GetInt32());
		Assert.Equal(2, run.Json.GetProperty("failedCount").GetInt32());
	}

	[Fact]
	public async Task Sign_asks_signer_again_when_the_last_step_gets_no_answer() {
		var signer = new FakeSignerGateway();
		var applied = signer.Add(Document("Applied", SignerAction(Cpf, null)));
		var notApplied = signer.Add(Document("Not applied", SignerAction(Cpf, null)));
		signer.CompleteErrors[applied.Id] = (Unreachable(), ApplyBeforeError: true);
		signer.CompleteErrors[notApplied.Id] = (Unreachable(), ApplyBeforeError: false);

		var run = await CliRunner.RunAsync(["sign", "--thumbprint", PierreThumbprint, "--id", applied.Id.ToString(), "--id", notApplied.Id.ToString()], signer);

		Assert.Equal(ExitCodes.SomeDocumentsFailed, run.ExitCode);
		var results = ResultsById(run);
		Assert.Equal("signed", results[applied.Id].GetProperty("status").GetString());
		Assert.Equal(ErrorCodes.OutcomeUnknown, CodeOf(results[notApplied.Id], "unknown"));
		Assert.Equal(1, run.Json.GetProperty("unknownCount").GetInt32());
	}

	[Fact]
	public async Task Sign_stops_between_documents_when_canceled_and_still_prints_the_results() {
		using var cancellation = CancellationTokenSource.CreateLinkedTokenSource(TestContext.Current.CancellationToken);
		var signer = new FakeSignerGateway();
		var first = signer.Add(Document("First", SignerAction(Cpf, null)));
		var second = signer.Add(Document("Second", SignerAction(Cpf, null)));
		signer.Completing = _ => cancellation.Cancel();

		var run = await CliRunner.RunAsync(["sign", "--thumbprint", PierreThumbprint, "--id", first.Id.ToString(), "--id", second.Id.ToString()], signer, cancellationToken: cancellation.Token);

		Assert.Equal(ExitCodes.Canceled, run.ExitCode);
		Assert.Empty(run.Error);
		var results = ResultsById(run);
		Assert.Equal("signed", results[first.Id].GetProperty("status").GetString());
		Assert.Equal(ErrorCodes.Canceled, CodeOf(results[second.Id], "notAttempted"));
		Assert.Single(signer.Completed);
	}

	[Fact]
	public async Task Sign_stops_the_batch_after_an_error_that_every_document_would_hit() {
		var signer = new FakeSignerGateway();
		var first = signer.Add(Document("First", SignerAction(Cpf, null)));
		var second = signer.Add(Document("Second", SignerAction(Cpf, null)));
		signer.StartErrors[first.Id] = HttpError(HttpStatusCode.Unauthorized);

		var run = await CliRunner.RunAsync(["sign", "--thumbprint", PierreThumbprint, "--id", first.Id.ToString(), "--id", second.Id.ToString()], signer);

		Assert.Equal(ExitCodes.SomeDocumentsFailed, run.ExitCode);
		var results = ResultsById(run);
		Assert.Equal(ErrorCodes.InvalidSignerApiKey, CodeOf(results[first.Id], "failed"));
		Assert.Equal(ErrorCodes.InvalidSignerApiKey, CodeOf(results[second.Id], "notAttempted"));
		Assert.Single(signer.ActionUrlRequests);
	}

	[Fact]
	public async Task Sign_on_a_sign_rule_asks_for_the_rules_action_and_the_rule_users_email() {
		var signer = new FakeSignerGateway();
		var rule = SignRuleAction(RuleUser("56072386105", null), RuleUser(Cpf, "pierre@example.com"));
		var document = signer.Add(Document("Rule", rule));

		var run = await CliRunner.RunAsync(["sign", "--thumbprint", PierreThumbprint, "--id", document.Id.ToString()], signer);

		Assert.Equal(ExitCodes.Success, run.ExitCode);
		var (_, request) = Assert.Single(signer.ActionUrlRequests);
		Assert.Equal(rule.Id, request.FlowActionId);
		Assert.Equal(Cpf, request.Identifier);
		Assert.Equal("pierre@example.com", request.EmailAddress);
	}

	private static Dictionary<Guid, JsonElement> ResultsById(CliRun run)
		=> run.Json.GetProperty("results").EnumerateArray().ToDictionary(r => r.GetProperty("documentId").GetGuid());

	private static string? CodeOf(JsonElement result, string status) {
		Assert.Equal(status, result.GetProperty("status").GetString());
		return result.GetProperty("error").GetProperty("code").GetString();
	}

	private static string? ErrorCodeOf(JsonElement result) => CodeOf(result, "failed");
}
