using System.CommandLine;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Serialization;
using Lacuna.Pki;
using Lacuna.RestClient;
using Lacuna.Signer.Client;
using SkillFriendlySignatureApp.Certificates;
using SkillFriendlySignatureApp.Commands;
using SkillFriendlySignatureApp.Signer;

namespace SkillFriendlySignatureApp;

/// <summary>
/// What the commands depend on. Program.cs passes the real ones; the tests pass fakes.
/// </summary>
/// <param name="CreateSignerGateway">Called only by the commands that call Signer, so `certs` runs without an API key.</param>
/// <param name="CreateCertificateSource">Called only by the commands that read certificates. It loads the PKI SDK license.</param>
public record CliServices(
	TextWriter Output,
	TextWriter Error,
	Func<ISignerGateway> CreateSignerGateway,
	Func<ICertificateSource> CreateCertificateSource,
	TimeProvider Time
);

/// <summary>
/// The command line contract an agent relies on: results as JSON on stdout, errors as
/// {"error":{"code","message"}} on stderr, an exit code per kind of failure (ExitCodes), and no
/// prompts. Only --help prints plain text.
/// </summary>
public static class Cli {

	private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web) {
		WriteIndented = true,
		DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
		// Keep accented names readable ("Revisão", not "Revisão").
		Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
		Converters = { new JsonStringEnumConverter() },
	};

	public static async Task<int> RunAsync(string[] args, CliServices services, CancellationToken cancellationToken = default) {
		var root = new RootCommand("Lists the documents pending signature for a participant on Signer (DropSigner by default) and signs them with a certificate from the Windows store. Prints JSON.") {
			CertsCommand.Create(services),
			ListCommand.Create(services),
			SignCommand.Create(services),
		};

		var parseResult = root.Parse(args);
		if (parseResult.Errors.Count > 0) {
			WriteError(services, ErrorCodes.InvalidArguments, string.Join(" ", parseResult.Errors.Select(e => e.Message)) + " Run with --help for usage.");
			return ExitCodes.InvalidArguments;
		}
		return await parseResult.InvokeAsync(new InvocationConfiguration {
			Output = services.Output,
			Error = services.Error,
			EnableDefaultExceptionHandler = false,
		}, cancellationToken);
	}

	/// <summary>
	/// Runs a command's work, writes its result to stdout and turns every failure into a JSON error
	/// and its exit code.
	/// </summary>
	public static async Task<int> RunCommandAsync(CliServices services, Func<Task<(object Result, int ExitCode)>> work) {
		try {
			var (result, exitCode) = await work();
			WriteJson(services.Output, result);
			return exitCode;
		} catch (Exception ex) {
			var (code, message, exitCode) = Describe(ex);
			WriteError(services, code, message);
			return exitCode;
		}
	}

	/// <summary>
	/// The code, message and exit code to report for an exception.
	/// </summary>
	public static (string Code, string Message, int ExitCode) Describe(Exception ex) => ex switch {
		AppException app => (app.Code, app.Message, app.ExitCode),
		// Signer's own error code, such as CpfMismatch or DocumentNotFound.
		SignerApiException api => (api.Code.ToString(), api.ErrorMessage ?? api.Message, ExitCodes.Signer),
		RestException or HttpRequestException or TaskCanceledException => (ErrorCodes.SignerUnavailable, $"Could not reach Signer: {ex.Message}", ExitCodes.Signer),
		LicenseException => (ErrorCodes.InvalidPkiSdkLicense, $"PKI SDK license problem: {ex.Message}", ExitCodes.Configuration),
		_ => (ErrorCodes.Unexpected, ex.ToString(), ExitCodes.Unexpected),
	};

	public static void WriteJson(TextWriter writer, object value) {
		writer.WriteLine(JsonSerializer.Serialize(value, JsonOptions));
		writer.Flush();
	}

	private static void WriteError(CliServices services, string code, string message) {
		WriteJson(services.Error, new { error = new { code, message } });
	}
}
