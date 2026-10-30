using Lacuna.Pki;
using Lacuna.Pki.Stores;

namespace SkillFriendlySignatureApp.Certificates;

/// <summary>
/// Where the certificates with a private key come from: the Windows store when the app runs, a
/// PFX file in the tests.
/// </summary>
public interface ICertificateSource {
	List<PKCertificateWithKey> GetCertificatesWithKey();
}

/// <summary>
/// The current user's personal certificate store (CurrentUser\My), read through PKI SDK. It
/// includes the certificates of A3 tokens and smart cards whose drivers are installed.
/// </summary>
public class WindowsCertificateSource : ICertificateSource {

	public List<PKCertificateWithKey> GetCertificatesWithKey() {
		if (!OperatingSystem.IsWindows()) {
			throw new AppException(ErrorCodes.UnsupportedPlatform, "The certificate store is available on Windows only.", ExitCodes.Certificate);
		}
		return WindowsCertificateStore.LoadPersonalCurrentUser().GetCertificatesWithKey();
	}
}

/// <summary>
/// A certificate the app can sign with: it has a private key, it is within its validity period,
/// and it carries an ICP-Brasil CPF, which Signer matches against the participant.
/// </summary>
public class LocalCertificate(PKCertificateWithKey certificateWithKey, string cpf) {

	public PKCertificate Certificate => certificateWithKey.Certificate;

	/// <summary>
	/// The SHA-1 thumbprint in uppercase hex, the form Windows shows.
	/// </summary>
	public string Thumbprint => Convert.ToHexString(Certificate.ThumbprintSHA1);

	public string Cpf { get; } = cpf;

	/// <summary>
	/// Signs a hash computed elsewhere (by Signer) with the private key. For an RSA key this is a
	/// PKCS#1 v1.5 signature, the same one Web PKI's signHash() makes in a browser.
	/// </summary>
	public byte[] SignHash(DigestAlgorithm digestAlgorithm, byte[] hash) => certificateWithKey.SignHash(digestAlgorithm, hash);
}

public static class LocalCertificates {

	/// <summary>
	/// The certificates the app can sign with, sorted by subject name.
	/// </summary>
	public static List<LocalCertificate> ListUsable(ICertificateSource source, DateTimeOffset now) {
		var usable = new List<LocalCertificate>();
		foreach (var certificateWithKey in source.GetCertificatesWithKey()) {
			var certificate = certificateWithKey.Certificate;
			if (certificate.ValidityStart > now || certificate.ValidityEnd < now) {
				continue;
			}
			var cpf = CpfNumber.Digits(certificate.PkiBrazil?.CPF);
			if (CpfNumber.IsValid(cpf)) {
				usable.Add(new LocalCertificate(certificateWithKey, cpf));
			}
		}
		return usable.OrderBy(c => c.Certificate.SubjectDisplayName, StringComparer.CurrentCulture).ToList();
	}

	/// <summary>
	/// Finds a usable certificate by its SHA-1 thumbprint, written in any case, with or without
	/// spaces or colons.
	/// </summary>
	public static LocalCertificate Find(ICertificateSource source, string thumbprint, DateTimeOffset now) {
		var wanted = new string(thumbprint.Where(char.IsAsciiHexDigit).ToArray()).ToUpperInvariant();
		return ListUsable(source, now).FirstOrDefault(c => c.Thumbprint == wanted)
			?? throw new AppException(ErrorCodes.CertificateNotFound, $"No certificate with thumbprint {wanted} that has a private key, is valid and carries a CPF. Run `certs` to list the ones that do.", ExitCodes.Certificate);
	}
}
