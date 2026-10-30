using Lacuna.Signer.Api;
using Lacuna.Signer.Api.Documents;
using Lacuna.Signer.Api.FlowActions;
using Lacuna.Signer.Api.Users;
using Lacuna.Signer.Client;
using SkillFriendlySignatureApp.Certificates;
using SkillFriendlySignatureApp.Signer;
using SkillFriendlySignatureApp.Tests.TestSupport;

namespace SkillFriendlySignatureApp.Tests;

/// <summary>
/// End-to-end runs against the Signer sandbox, always the sandbox: production DropSigner refuses
/// Lacuna test certificates, and these tests create documents. They are skipped unless:
///   - Signer__ApiKey holds an API key of the sandbox, and
///   - the Windows store has a Lacuna test certificate (issued by "Lacuna CA Test v7") with a
///     private key and a CPF, or SkillSignatureTests__Thumbprint names a certificate to use.
/// The documents they create are left on the sandbox: a signed document cannot be deleted.
/// </summary>
public class LiveSandboxTests {

	private const string SandboxEndpoint = "https://signer-lac.azurewebsites.net";
	private const string TestIssuer = "Lacuna CA Test v7";

	[Fact]
	public async Task A_document_for_the_certificates_cpf_is_listed_then_signed() {
		var (client, certificate) = Arrange();
		var documentId = await CreateDocumentAsync(client, new ParticipantUserModel { Name = certificate.Certificate.SubjectDisplayName, Identifier = certificate.Cpf, Email = UniqueEmail() });

		var before = await RunAsync(client, "list", "--cpf", certificate.Cpf);
		Assert.Contains(documentId, ListedIds(before));

		var sign = await RunAsync(client, "sign", "--thumbprint", certificate.Thumbprint, "--id", documentId.ToString());
		Assert.True(sign.ExitCode == ExitCodes.Success, sign.Output + sign.Error);

		var after = await RunAsync(client, "list", "--cpf", certificate.Cpf);
		Assert.DoesNotContain(documentId, ListedIds(after));
	}

	/// <summary>
	/// A participant created with an email and no CPF, signing with a certificate that has a CPF.
	/// This settles what Signer does then, which its documentation does not say.
	/// </summary>
	[Fact]
	public async Task A_participant_known_by_email_only_signs_with_a_certificate() {
		var (client, certificate) = Arrange();
		var email = UniqueEmail();
		var documentId = await CreateDocumentAsync(client, new ParticipantUserModel { Name = certificate.Certificate.SubjectDisplayName, Email = email });

		var listed = await RunAsync(client, "list", "--email", email);
		Assert.Equal([documentId], ListedIds(listed));

		var sign = await RunAsync(client, "sign", "--thumbprint", certificate.Thumbprint, "--id", documentId.ToString(), "--email", email);
		Assert.True(sign.ExitCode == ExitCodes.Success, sign.Output + sign.Error);

		var details = await client.GetDocumentDetailsAsync(documentId);
		Assert.Equal(ActionStatus.Completed, details.FlowActions.Single().Status);
	}

	private static (SignerClient Client, LocalCertificate Certificate) Arrange() {
		var apiKey = Environment.GetEnvironmentVariable("Signer__ApiKey");
		if (string.IsNullOrWhiteSpace(apiKey)) {
			Assert.Skip("Set Signer__ApiKey to a Signer sandbox API key to run the live tests.");
		}
		if (!OperatingSystem.IsWindows()) {
			Assert.Skip("The live tests sign with a certificate from the Windows store.");
		}

		var certificates = LocalCertificates.ListUsable(new WindowsCertificateSource(), DateTimeOffset.UtcNow);
		var thumbprint = Environment.GetEnvironmentVariable("SkillSignatureTests__Thumbprint");
		var certificate = string.IsNullOrWhiteSpace(thumbprint)
			? certificates.FirstOrDefault(c => c.Certificate.IssuerDisplayName == TestIssuer)
			: certificates.FirstOrDefault(c => c.Thumbprint == thumbprint.Replace(" ", "").ToUpperInvariant());
		if (certificate == null) {
			Assert.Skip($"No usable certificate for the live tests: import a Lacuna test certificate (issued by {TestIssuer}, with a CPF) into CurrentUser\\My, or set SkillSignatureTests__Thumbprint. See https://docs.lacunasoftware.com/articles/pki-guide/test-certs");
		}
		return (new SignerClient(SandboxEndpoint, apiKey), certificate);
	}

	private static async Task<Guid> CreateDocumentAsync(SignerClient client, ParticipantUserModel participant) {
		var pdf = await File.ReadAllBytesAsync(Path.Combine(AppContext.BaseDirectory, "Content", "SamplePdf.pdf"), TestContext.Current.CancellationToken);
		var upload = await client.UploadFileAsync("SamplePdf.pdf", pdf, "application/pdf");
		var result = await client.CreateDocumentAsync(new CreateDocumentRequest {
			Files = [new FileUploadModel(upload) { DisplayName = $"SkillFriendlySignatureApp live test {DateTimeOffset.UtcNow:yyyy-MM-dd HH:mm:ss}Z" }],
			FlowActions = [new FlowActionCreateModel { Type = FlowActionType.Signer, User = participant }],
		});
		return result.Single().DocumentId;
	}

	private static Task<CliRun> RunAsync(SignerClient client, params string[] args)
		=> CliRunner.RunAsync(args, new SignerGateway(client), new WindowsCertificateSource(), DateTimeOffset.UtcNow);

	private static List<Guid> ListedIds(CliRun run) {
		Assert.True(run.ExitCode == ExitCodes.Success, run.Output + run.Error);
		return run.Json.GetProperty("documents").EnumerateArray().Select(d => d.GetProperty("id").GetGuid()).ToList();
	}

	private static string UniqueEmail() => $"skill-signature-{Guid.NewGuid():N}@mailinator.com";
}
