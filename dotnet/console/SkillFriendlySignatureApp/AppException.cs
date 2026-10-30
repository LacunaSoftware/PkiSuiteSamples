namespace SkillFriendlySignatureApp;

/// <summary>
/// The process exit codes. A caller (such as an agent skill) can branch on them without parsing
/// the error message.
/// </summary>
public static class ExitCodes {

	public const int Success = 0;

	/// <summary>
	/// `sign` ran, but at least one document failed. Its results on stdout say which.
	/// </summary>
	public const int SomeDocumentsFailed = 1;

	/// <summary>
	/// A missing or invalid argument, such as an unknown flag or a CPF with wrong check digits.
	/// </summary>
	public const int InvalidArguments = 2;

	/// <summary>
	/// A missing Signer API key or an invalid PKI SDK license.
	/// </summary>
	public const int Configuration = 3;

	/// <summary>
	/// The certificate was not found in the store, or the store is not available on this OS.
	/// </summary>
	public const int Certificate = 4;

	/// <summary>
	/// Signer answered with an error, or could not be reached.
	/// </summary>
	public const int Signer = 5;

	public const int Unexpected = 10;
}

/// <summary>
/// The codes of the errors this app raises itself. Errors that Signer returns keep Signer's own
/// code, such as CpfMismatch or DocumentNotFound.
/// </summary>
public static class ErrorCodes {
	public const string InvalidArguments = "InvalidArguments";
	public const string InvalidCpf = "InvalidCpf";
	public const string InvalidEmail = "InvalidEmail";
	public const string MissingSignerApiKey = "MissingSignerApiKey";
	public const string MissingPkiSdkLicense = "MissingPkiSdkLicense";
	public const string InvalidPkiSdkLicense = "InvalidPkiSdkLicense";
	public const string UnsupportedPlatform = "UnsupportedPlatform";
	public const string CertificateNotFound = "CertificateNotFound";
	public const string NotPending = "NotPending";
	public const string InvalidActionUrl = "InvalidActionUrl";
	public const string CertificateRejected = "CertificateRejected";
	public const string UnsupportedDigestAlgorithm = "UnsupportedDigestAlgorithm";
	public const string SignerUnavailable = "SignerUnavailable";
	public const string Unexpected = "Unexpected";
}

/// <summary>
/// An error to report as JSON on stderr, with its code and exit code.
/// </summary>
public class AppException(string code, string message, int exitCode) : Exception(message) {

	public string Code { get; } = code;

	public int ExitCode { get; } = exitCode;
}
