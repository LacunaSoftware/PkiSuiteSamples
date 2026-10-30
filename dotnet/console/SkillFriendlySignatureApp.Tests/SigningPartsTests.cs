using Lacuna.Signer.Api.Documents;
using Microsoft.Extensions.Configuration;
using SkillFriendlySignatureApp.Certificates;
using SkillFriendlySignatureApp.Commands;
using SkillFriendlySignatureApp.Signer;
using SkillFriendlySignatureApp.Tests.TestSupport;

namespace SkillFriendlySignatureApp.Tests;

public class DigestAlgorithmTests {

	[Theory]
	[InlineData("2.16.840.1.101.3.4.2.1")]
	[InlineData("SHA256")]
	[InlineData("SHA-256")]
	[InlineData("sha256")]
	public void Signer_digest_algorithm_is_read_as_an_oid_or_a_name(string value) {
		Assert.Equal("2.16.840.1.101.3.4.2.1", SignCommand.ParseDigestAlgorithm(value).Oid);
	}

	[Theory]
	[InlineData("MD4")]
	[InlineData("")]
	[InlineData(null)]
	public void An_unknown_digest_algorithm_is_an_error(string? value) {
		Assert.Equal(ErrorCodes.UnsupportedDigestAlgorithm, Assert.Throws<AppException>(() => SignCommand.ParseDigestAlgorithm(value)).Code);
	}
}

public class PublicSignatureLinkTests {

	[Fact]
	public void Key_and_ticket_come_from_the_action_url() {
		var link = PublicSignatureLink.Parse(new ActionUrlResponse { Url = "https://www.dropsigner.com/document/key/AbC123/sign?ticket=T%2Bx%3D&lang=pt" });

		Assert.Equal(new PublicSignatureLink("AbC123", "T+x="), link);
	}

	[Fact]
	public void The_embed_url_is_the_fallback() {
		var link = PublicSignatureLink.Parse(new ActionUrlResponse { Url = "https://www.dropsigner.com/private/documents", EmbedUrl = "https://www.dropsigner.com/embed/key/k1?ticket=t1" });

		Assert.Equal(new PublicSignatureLink("k1", "t1"), link);
	}

	[Fact]
	public void An_action_url_without_key_or_ticket_is_an_error() {
		var ex = Assert.Throws<AppException>(() => PublicSignatureLink.Parse(new ActionUrlResponse { Url = "https://www.dropsigner.com/document/key/k1/sign" }));
		Assert.Equal(ErrorCodes.InvalidActionUrl, ex.Code);
	}
}

public class LocalCertificatesTests {

	[Fact]
	public void The_cpf_is_read_from_the_certificate() {
		var certificate = LocalCertificates.ListUsable(PfxCertificateSource.Pierre(), TestCertificates.WhilePierreIsValid()).Single();

		Assert.Equal(TestCertificates.PierreCpf, certificate.Cpf);
		Assert.Equal(40, certificate.Thumbprint.Length);
	}

	[Fact]
	public void An_expired_certificate_is_not_usable() {
		var afterExpiry = TestCertificates.LoadPierre().Certificate.ValidityEnd.AddDays(1);

		Assert.Empty(LocalCertificates.ListUsable(PfxCertificateSource.Pierre(), afterExpiry));
	}

	[Fact]
	public void Find_accepts_the_thumbprint_in_any_case_and_with_spaces() {
		var now = TestCertificates.WhilePierreIsValid();
		var thumbprint = LocalCertificates.ListUsable(PfxCertificateSource.Pierre(), now).Single().Thumbprint;
		var spaced = string.Join(' ', thumbprint.Chunk(2).Select(c => new string(c))).ToLowerInvariant();

		Assert.Equal(thumbprint, LocalCertificates.Find(PfxCertificateSource.Pierre(), spaced, now).Thumbprint);
	}

	[Fact]
	public void Find_reports_an_unknown_thumbprint() {
		var ex = Assert.Throws<AppException>(() => LocalCertificates.Find(PfxCertificateSource.Pierre(), "00", TestCertificates.WhilePierreIsValid()));

		Assert.Equal(ErrorCodes.CertificateNotFound, ex.Code);
		Assert.Equal(ExitCodes.Certificate, ex.ExitCode);
	}
}

public class PkiSdkLicenseTests {

	[Fact]
	public void A_base64_license_in_configuration_is_loaded() {
		var file = File.ReadAllBytes(Path.Combine(AppContext.BaseDirectory, PkiSdkLicense.FileName));
		var configuration = new ConfigurationBuilder()
			.AddInMemoryCollection(new Dictionary<string, string?> { ["PkiSdk:License"] = Convert.ToBase64String(file) })
			.Build();

		PkiSdkLicense.Load(configuration);
	}

	[Fact]
	public void A_license_that_is_not_base64_is_an_error() {
		var configuration = new ConfigurationBuilder()
			.AddInMemoryCollection(new Dictionary<string, string?> { ["PkiSdk:License"] = "not base64!" })
			.Build();

		Assert.Equal(ErrorCodes.InvalidPkiSdkLicense, Assert.Throws<AppException>(() => PkiSdkLicense.Load(configuration)).Code);
	}
}
