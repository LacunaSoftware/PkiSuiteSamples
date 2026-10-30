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
	/// A missing or refused Signer API key, an invalid Signer endpoint, or a missing or invalid
	/// PKI SDK license.
	/// </summary>
	public const int Configuration = 3;

	/// <summary>
	/// No usable certificate with that thumbprint (missing, expired, or without a private key or
	/// CPF), or the store is not available on this OS.
	/// </summary>
	public const int Certificate = 4;

	/// <summary>
	/// Signer answered with an error, or could not be reached. Only from `list`: `sign` reports
	/// Signer errors per document and exits with SomeDocumentsFailed.
	/// </summary>
	public const int Signer = 5;

	/// <summary>
	/// The user canceled the command (Ctrl+C). `sign` still prints its results: it stops between
	/// documents, never in the middle of one.
	/// </summary>
	public const int Canceled = 6;

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
	public const string InvalidSignerApiKey = "InvalidSignerApiKey";
	public const string InvalidSignerEndpoint = "InvalidSignerEndpoint";
	public const string MissingPkiSdkLicense = "MissingPkiSdkLicense";
	public const string InvalidPkiSdkLicense = "InvalidPkiSdkLicense";
	public const string UnsupportedPlatform = "UnsupportedPlatform";
	public const string CertificateNotFound = "CertificateNotFound";
	public const string NotPending = "NotPending";
	public const string InvalidActionUrl = "InvalidActionUrl";
	public const string CertificateRejected = "CertificateRejected";
	public const string SignatureRejected = "SignatureRejected";
	public const string PrivateKeyUnavailable = "PrivateKeyUnavailable";
	public const string UnsupportedDigestAlgorithm = "UnsupportedDigestAlgorithm";
	public const string OutcomeUnknown = "OutcomeUnknown";
	public const string SignerUnavailable = "SignerUnavailable";
	public const string SignerError = "SignerError";
	public const string Canceled = "Canceled";
	public const string Unexpected = "Unexpected";
}

/// <summary>
/// An error to report as JSON on stderr, with its code and exit code.
/// </summary>
public class AppException(string code, string message, int exitCode) : Exception(message) {

	public string Code { get; } = code;

	public int ExitCode { get; } = exitCode;
}
