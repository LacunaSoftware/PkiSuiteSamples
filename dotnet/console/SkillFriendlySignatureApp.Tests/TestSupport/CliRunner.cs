using System.Text.Json;
using SkillFriendlySignatureApp.Certificates;
using SkillFriendlySignatureApp.Signer;

namespace SkillFriendlySignatureApp.Tests.TestSupport;

/// <summary>
/// What a caller of the app sees: the exit code, stdout and stderr.
/// </summary>
public record CliRun(int ExitCode, string Output, string Error) {

	public JsonElement Json => JsonDocument.Parse(Output).RootElement;

	public string? ErrorCode => JsonDocument.Parse(Error).RootElement.GetProperty("error").GetProperty("code").GetString();
}

public static class CliRunner {

	/// <summary>
	/// Runs the app in-process. Without a signer, the commands that call Signer fail as they do
	/// without an API key; without a certificate source, Pierre de Fermat's PFX stands in for the
	/// Windows store.
	/// </summary>
	public static async Task<CliRun> RunAsync(string[] args, ISignerGateway? signer = null, ICertificateSource? certificates = null, DateTimeOffset? now = null) {
		var output = new StringWriter();
		var error = new StringWriter();
		var services = new CliServices(
			output,
			error,
			() => signer ?? throw new AppException(ErrorCodes.MissingSignerApiKey, "The Signer API key is not set.", ExitCodes.Configuration),
			() => certificates ?? PfxCertificateSource.Pierre(),
			new FixedTimeProvider(now ?? TestCertificates.WhilePierreIsValid())
		);
		var exitCode = await Cli.RunAsync(args, services, TestContext.Current.CancellationToken);
		return new CliRun(exitCode, output.ToString(), error.ToString());
	}
}
