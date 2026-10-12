using Lacuna.RestPki.Api;
using Lacuna.RestPki.Api.Authentication;
using Lacuna.RestPki.Client;
using Microsoft.AspNetCore.Mvc;
using PkiSuiteAspNetCoreAngularSample.Classes;

namespace PkiSuiteAspNetCoreAngularSample.Controllers;

/// <summary>
/// Certificate authentication with Rest PKI Core (sample "authentication-rest-pki-core").
/// </summary>
/// <remarks>
/// Authentication is a challenge: Rest PKI Core issues a hash to be signed, the user signs it with
/// their certificate's private key in the browser (Web PKI signHash), and Rest PKI Core checks the
/// signature and the certificate. The certificate the browser sends is never trusted on its own:
/// only the check in Complete() proves that the user holds its private key and that it was issued
/// by a certification authority trusted by the security context.
/// </remarks>
[ApiController]
[Route("api/authentication-rest-pki-core")]
public class AuthenticationRestPkiCoreController(Util util) : ControllerBase {

	// POST api/authentication-rest-pki-core/start
	[HttpPost("start")]
	public async Task<ActionResult<AuthenticationRestPkiCoreStartResponse>> Start() {
		if (!util.IsRestPkiCoreConfigured) {
			return Problem(detail: Util.RestPkiCoreNotConfiguredMessage, statusCode: StatusCodes.Status503ServiceUnavailable);
		}

		var restPkiService = util.GetRestPkiService();

		// Start the authentication. The security context determines which certification
		// authorities are trusted (see Util.GetSecurityContextId()).
		var prepareResult = await restPkiService.PrepareAuthenticationAsync(securityContextId: util.GetSecurityContextId());

		// The browser signs the hash with Web PKI's signHash, and sends back the state, which
		// Rest PKI Core needs to complete the authentication.
		return new AuthenticationRestPkiCoreStartResponse(
			prepareResult.State,
			prepareResult.ToSign.Hash,
			prepareResult.ToSign.SignatureAlgorithm.DigestAlgorithm.Oid
		);
	}

	// POST api/authentication-rest-pki-core/complete
	[HttpPost("complete")]
	public async Task<ActionResult<AuthenticationRestPkiCoreCompleteResponse>> Complete(AuthenticationRestPkiCoreCompleteRequest request) {
		if (!util.IsRestPkiCoreConfigured) {
			return Problem(detail: Util.RestPkiCoreNotConfiguredMessage, statusCode: StatusCodes.Status503ServiceUnavailable);
		}

		var restPkiService = util.GetRestPkiService();

		// Complete the authentication. Rest PKI Core checks that the signature matches the
		// certificate (which proves that the user holds its private key), that the hash was issued
		// for this state and was not used before, and that the certificate is valid and trusted by
		// the security context.
		AuthenticationResult result;
		try {
			result = await restPkiService.CompleteAuthenticationAsync(request.State, request.Certificate, request.Signature);
		} catch (RestPkiExceptionV2 ex) when (ex.ErrorCode is ErrorCodesV2.BadSignature or ErrorCodesV2.InvalidNonceSignature) {
			// The signature does not match the hash and the certificate: the user did not prove that
			// they hold the certificate's private key. Rest PKI Core answers this with an error
			// instead of a failed AuthenticationResult.
			return Problem(
				detail: "Authentication failed: the signature does not match the certificate.",
				statusCode: StatusCodes.Status422UnprocessableEntity
			);
		}

		if (!result.Success) {
			// The authentication failed. Do not log the user in.
			return Problem(
				detail: result.Failure switch {
					AuthenticationFailures.CertificateFailedValidation => "Authentication failed: the certificate failed validation.",
					// The hash expired or was already used: start again.
					AuthenticationFailures.StaleSession => "The authentication expired. Please try again.",
					AuthenticationFailures.NonceReused => "This authentication was already used. Please try again.",
					_ => $"The authentication failed ({result.Failure}).",
				},
				statusCode: StatusCodes.Status422UnprocessableEntity,
				// The validation results, when there are any, tell why. The page shows them below the
				// message.
				extensions: new Dictionary<string, object?> { ["validationResults"] = result.ValidationResults?.ToString() }
			);
		}

		// The user is authenticated. This is where your application would find the user by one of
		// the certificate's fields (for instance, the ICP-Brasil CPF) and start a session.
		return new AuthenticationRestPkiCoreCompleteResponse(
			AuthenticationRestPkiCoreCertificateModel.FromCertificate(result.Certificate),
			result.ValidationResults?.ToString()
		);
	}
}

public record AuthenticationRestPkiCoreStartResponse(string State, byte[] ToSignHash, string DigestAlgorithmOid);

public record AuthenticationRestPkiCoreCompleteRequest(string State, byte[] Certificate, byte[] Signature);

public record AuthenticationRestPkiCoreCompleteResponse(AuthenticationRestPkiCoreCertificateModel Certificate, string? ValidationResults);

/// <summary>
/// The fields of the authenticated certificate that the page shows.
/// </summary>
public record AuthenticationRestPkiCoreCertificateModel(
	string? SubjectName,
	string? EmailAddress,
	string? IssuerName,
	string? SerialNumber,
	DateTimeOffset ValidityStart,
	DateTimeOffset ValidityEnd,
	string? ThumbprintSha256,
	AuthenticationRestPkiCorePkiBrazilModel? PkiBrazil
) {
	public static AuthenticationRestPkiCoreCertificateModel FromCertificate(PKCertificate certificate) => new(
		certificate.SubjectName?.CommonName,
		certificate.EmailAddress,
		certificate.IssuerName?.CommonName,
		certificate.SerialNumber.ToString(),
		certificate.ValidityStart,
		certificate.ValidityEnd,
		certificate.ThumbprintSHA256?.Value is { } thumbprint ? Convert.ToHexString(thumbprint) : null,
		certificate.PkiBrazil is { } pkiBrazil ? new AuthenticationRestPkiCorePkiBrazilModel(
			pkiBrazil.Cpf,
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
public record AuthenticationRestPkiCorePkiBrazilModel(
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
