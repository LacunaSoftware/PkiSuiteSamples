using Lacuna.Pki;
using Microsoft.AspNetCore.Mvc;
using PkiSuiteAspNetCoreAngularSample.Classes;

namespace PkiSuiteAspNetCoreAngularSample.Controllers;

/// <summary>
/// Certificate authentication with PKI SDK (sample "authentication-pki-sdk").
/// </summary>
/// <remarks>
/// Authentication is a challenge: the server issues a random nonce, the user signs it with their
/// certificate's private key in the browser (Web PKI signData), and the server checks the
/// signature, the nonce and the certificate. The certificate the browser sends is never trusted on
/// its own: only the server-side check in Complete() proves that the user holds its private key and
/// that it was issued by a trusted certification authority.
/// </remarks>
[ApiController]
[Route("api/authentication-pki-sdk")]
public class AuthenticationPkiSdkController(Util util) : ControllerBase {

	// POST api/authentication-pki-sdk/start
	[HttpPost("start")]
	public AuthenticationPkiSdkStartResponse Start() {

		// The PKCertificateAuthentication class needs a "nonce store", which remembers the nonces it
		// issued so that each one is accepted only once (see Util.GetNonceStore()).
		var certAuth = new PKCertificateAuthentication(util.GetNonceStore());

		// Generate a nonce (random bytes) and keep it on the nonce store.
		var nonce = certAuth.Start();

		// The browser signs the nonce with Web PKI's signData, using this digest algorithm.
		return new AuthenticationPkiSdkStartResponse(nonce, PKCertificateAuthentication.DigestAlgorithm.Oid);
	}

	// POST api/authentication-pki-sdk/complete
	[HttpPost("complete")]
	public ActionResult<AuthenticationPkiSdkCompleteResponse> Complete(AuthenticationPkiSdkCompleteRequest request) {

		var certAuth = new PKCertificateAuthentication(util.GetNonceStore());

		// Complete the authentication. PKI SDK checks that:
		// - the nonce was issued by this server and was not used before (it is removed from the
		//   nonce store, so it cannot be replayed);
		// - the signature over the nonce matches the certificate, which proves that the user holds
		//   the certificate's private key;
		// - the certificate is valid and was issued by a trusted root (see Util.GetTrustArbitrator()).
		var validationResults = certAuth.Complete(
			request.Nonce,
			request.Certificate,
			request.Signature,
			util.GetTrustArbitrator(),
			out var certificate
		);

		if (!validationResults.IsValid) {
			// The authentication failed. Do not log the user in. The validation results tell why
			// (for instance, the certificate is expired, revoked or was issued by an untrusted root).
			return Problem(
				detail: "Authentication failed: the certificate or the signature failed validation.",
				statusCode: StatusCodes.Status422UnprocessableEntity,
				// The page shows the validation results below the message.
				extensions: new Dictionary<string, object?> { ["validationResults"] = validationResults.ToString() }
			);
		}

		// The user is authenticated. This is where your application would find the user by one of
		// the certificate's fields (for instance, the ICP-Brasil CPF) and start a session.
		return new AuthenticationPkiSdkCompleteResponse(
			AuthenticationPkiSdkCertificateModel.FromCertificate(certificate),
			validationResults.ToString()
		);
	}
}

public record AuthenticationPkiSdkStartResponse(byte[] Nonce, string DigestAlgorithmOid);

public record AuthenticationPkiSdkCompleteRequest(byte[] Nonce, byte[] Certificate, byte[] Signature);

public record AuthenticationPkiSdkCompleteResponse(AuthenticationPkiSdkCertificateModel Certificate, string ValidationResults);

/// <summary>
/// The fields of the authenticated certificate that the page shows.
/// </summary>
public record AuthenticationPkiSdkCertificateModel(
	string? SubjectName,
	string? EmailAddress,
	string? IssuerName,
	string SerialNumber,
	DateTimeOffset ValidityStart,
	DateTimeOffset ValidityEnd,
	string ThumbprintSha256,
	AuthenticationPkiSdkPkiBrazilModel? PkiBrazil
) {
	public static AuthenticationPkiSdkCertificateModel FromCertificate(PKCertificate certificate) => new(
		certificate.SubjectDisplayName,
		certificate.EmailAddress,
		certificate.IssuerDisplayName,
		certificate.SerialNumber.ToString(),
		certificate.ValidityStart,
		certificate.ValidityEnd,
		Convert.ToHexString(certificate.ThumbprintSHA256),
		certificate.PkiBrazil is { } pkiBrazil ? new AuthenticationPkiSdkPkiBrazilModel(
			pkiBrazil.CertificateType.ToString(),
			pkiBrazil.CPF,
			pkiBrazil.Responsavel,
			pkiBrazil.DateOfBirth?.ToString("yyyy-MM-dd"),
			pkiBrazil.CompanyName,
			pkiBrazil.Cnpj,
			pkiBrazil.RGNumero,
			pkiBrazil.RGEmissor,
			pkiBrazil.RGEmissorUF,
			pkiBrazil.OabNumero,
			pkiBrazil.OabUF
		) : null
	);
}

/// <summary>
/// Fields of ICP-Brasil (PKI Brazil) certificates.
/// </summary>
public record AuthenticationPkiSdkPkiBrazilModel(
	string CertificateType,
	string? Cpf,
	string? Responsavel,
	string? DateOfBirth,
	string? CompanyName,
	string? Cnpj,
	string? RgNumero,
	string? RgEmissor,
	string? RgEmissorUf,
	string? OabNumero,
	string? OabUf
);
