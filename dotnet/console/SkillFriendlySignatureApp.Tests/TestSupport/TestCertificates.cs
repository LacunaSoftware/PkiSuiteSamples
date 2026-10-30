using System.Runtime.CompilerServices;
using Lacuna.Pki;
using Lacuna.Pki.Stores;
using Microsoft.Extensions.Configuration;
using SkillFriendlySignatureApp.Certificates;

namespace SkillFriendlySignatureApp.Tests.TestSupport;

public static class TestCertificates {

	public const string PierreCpf = "47363361886";

	/// <summary>
	/// PKI SDK needs its license before any test touches a certificate. The license file comes
	/// with the app project's output.
	/// </summary>
	[ModuleInitializer]
	internal static void LoadPkiSdkLicense() {
		PkiSdkLicense.Load(new ConfigurationBuilder().Build());
	}

	public static PKCertificateWithKey LoadPierre() {
		var pfx = File.ReadAllBytes(Path.Combine(AppContext.BaseDirectory, "Content", "Pierre de Fermat.pfx"));
		return Pkcs12CertificateStore.Load(pfx, "1234").GetCertificatesWithKey().Single();
	}

	/// <summary>
	/// A moment within Pierre de Fermat's validity period, so the tests do not depend on today.
	/// </summary>
	public static DateTimeOffset WhilePierreIsValid() {
		var certificate = LoadPierre().Certificate;
		return certificate.ValidityStart + (certificate.ValidityEnd - certificate.ValidityStart) / 2;
	}
}

/// <summary>
/// Certificates from PFX files, in place of the Windows store.
/// </summary>
public class PfxCertificateSource(params PKCertificateWithKey[] certificates) : ICertificateSource {

	public static PfxCertificateSource Pierre() => new(TestCertificates.LoadPierre());

	public List<PKCertificateWithKey> GetCertificatesWithKey() => certificates.ToList();
}

public class FixedTimeProvider(DateTimeOffset now) : TimeProvider {
	public override DateTimeOffset GetUtcNow() => now;
}
