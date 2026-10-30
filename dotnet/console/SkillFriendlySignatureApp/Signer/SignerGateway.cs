using Lacuna.Signer.Api.Documents;
using Lacuna.Signer.Api.Signature;
using Lacuna.Signer.Client;
using Lacuna.Spa.Api;
using Microsoft.Extensions.Configuration;

namespace SkillFriendlySignatureApp.Signer;

/// <summary>
/// The Signer API calls this app makes. SignerClient's methods are not virtual, so the tests
/// replace this interface instead.
/// </summary>
public interface ISignerGateway {

	/// <summary>GET /api/documents</summary>
	Task<PaginatedSearchResponse<DocumentListModel>> ListDocumentsAsync(DocumentListParameters parameters);

	/// <summary>GET /api/documents/{id}, which has the flow actions that the list lacks.</summary>
	Task<DocumentModel> GetDocumentDetailsAsync(Guid documentId);

	/// <summary>POST /api/documents/{id}/action-url</summary>
	Task<ActionUrlResponse> GetActionUrlAsync(Guid documentId, ActionUrlRequest request);

	/// <summary>POST /api/documents/keys/{key}/signature/certificate</summary>
	Task<StartSignatureResponse> StartPublicSignatureAsync(string key, PublicStartSignatureRequest request);

	/// <summary>
	/// POST /api/documents/keys/{key}/signature. Success is false when Signer refused the signature.
	/// </summary>
	Task<CompleteSignatureResponse> CompletePublicSignatureAsync(string key, CompleteSignatureRequest request);
}

public class SignerGateway(SignerClient client) : ISignerGateway {

	public const string DefaultEndpoint = "https://www.dropsigner.com";

	/// <summary>
	/// Returns a gateway authenticated with Signer:ApiKey on Signer:Endpoint (DropSigner by default).
	/// </summary>
	public static SignerGateway Create(IConfiguration configuration) {
		var apiKey = configuration["Signer:ApiKey"]?.Trim();
		if (string.IsNullOrEmpty(apiKey) || apiKey.StartsWith("YOUR_", StringComparison.Ordinal)) {
			throw new AppException(ErrorCodes.MissingSignerApiKey, "The Signer API key is not set. Run `dotnet user-secrets set Signer:ApiKey \"<app name>|<key>\"` in the project folder, or set the Signer__ApiKey environment variable.", ExitCodes.Configuration);
		}
		var endpoint = configuration["Signer:Endpoint"];
		if (string.IsNullOrWhiteSpace(endpoint)) {
			endpoint = DefaultEndpoint;
		}
		if (!Uri.TryCreate(endpoint, UriKind.Absolute, out var endpointUri) || (endpointUri.Scheme != Uri.UriSchemeHttps && endpointUri.Scheme != Uri.UriSchemeHttp)) {
			throw new AppException(ErrorCodes.InvalidSignerEndpoint, $"Signer:Endpoint is not an absolute URL, such as {DefaultEndpoint}: '{endpoint}'.", ExitCodes.Configuration);
		}
		return new SignerGateway(new SignerClient(endpoint, apiKey));
	}

	public Task<PaginatedSearchResponse<DocumentListModel>> ListDocumentsAsync(DocumentListParameters parameters)
		=> client.ListDocumentsAsync(parameters);

	public Task<DocumentModel> GetDocumentDetailsAsync(Guid documentId)
		=> client.GetDocumentDetailsAsync(documentId);

	public Task<ActionUrlResponse> GetActionUrlAsync(Guid documentId, ActionUrlRequest request)
		=> client.GetActionUrlAsync(documentId, request);

	public Task<StartSignatureResponse> StartPublicSignatureAsync(string key, PublicStartSignatureRequest request)
		=> client.StartPublicSignatureAsync(key, request);

	public Task<CompleteSignatureResponse> CompletePublicSignatureAsync(string key, CompleteSignatureRequest request)
		=> client.CompletePublicSignatureAsync(key, request);
}
