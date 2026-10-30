using System.Security.Cryptography;
using Lacuna.Signer.Api;
using Lacuna.Signer.Api.Documents;
using Lacuna.Signer.Api.Folders;
using Lacuna.Signer.Api.FlowActions;
using Lacuna.Signer.Api.Signature;
using Lacuna.Signer.Api.Users;
using Lacuna.Signer.Client;
using Lacuna.Spa.Api;
using SkillFriendlySignatureApp.Signer;
using SignerErrorCodes = Lacuna.Signer.Api.ErrorCodes;

namespace SkillFriendlySignatureApp.Tests.TestSupport;

/// <summary>
/// An in-memory Signer. The list returns every document (the real one filters by participant and
/// status, which the pending document rule must not rely on); the public signature endpoints
/// check the key, ticket and token they handed out, and record the signatures.
/// </summary>
public class FakeSignerGateway : ISignerGateway {

	public const string Sha256Oid = "2.16.840.1.101.3.4.2.1";

	public List<DocumentModel> Documents { get; } = [];

	public List<DocumentListParameters> ListRequests { get; } = [];

	public List<(Guid DocumentId, ActionUrlRequest Request)> ActionUrlRequests { get; } = [];

	/// <summary>The certificate and to-sign hash of each started signature, by key.</summary>
	public Dictionary<string, (byte[] Certificate, byte[] ToSignHash)> Started { get; } = [];

	/// <summary>The signature value of each completed signature, by key.</summary>
	public Dictionary<string, byte[]> Completed { get; } = [];

	/// <summary>Errors to throw when a document's signature starts.</summary>
	public Dictionary<Guid, Exception> StartErrors { get; } = [];

	/// <summary>The digest algorithm the start step answers with.</summary>
	public string DigestAlgorithm { get; set; } = Sha256Oid;

	public Exception? ListError { get; set; }

	public DocumentModel Add(DocumentModel document) {
		Documents.Add(document);
		return document;
	}

	public Task<PaginatedSearchResponse<DocumentListModel>> ListDocumentsAsync(DocumentListParameters parameters) {
		ListRequests.Add(parameters);
		if (ListError != null) {
			throw ListError;
		}
		return Task.FromResult(new PaginatedSearchResponse<DocumentListModel> {
			Items = Documents.Skip(parameters.Offset).Take(parameters.Limit)
				.Select(d => new DocumentListModel { Id = d.Id, Name = d.Name, CreationDate = d.CreationDate, Folder = d.Folder })
				.ToList(),
			TotalCount = Documents.Count,
		});
	}

	public Task<DocumentModel> GetDocumentDetailsAsync(Guid documentId) {
		var document = Documents.SingleOrDefault(d => d.Id == documentId)
			?? throw ApiError(SignerErrorCodes.DocumentNotFound, "Document not found.");
		return Task.FromResult(document);
	}

	public Task<ActionUrlResponse> GetActionUrlAsync(Guid documentId, ActionUrlRequest request) {
		ActionUrlRequests.Add((documentId, request));
		return Task.FromResult(new ActionUrlResponse {
			Url = $"https://signer.test/document/key/key-{documentId}/sign?ticket=ticket%2B{documentId}",
			EmbedUrl = $"https://signer.test/embed/key/key-{documentId}?ticket=ticket%2B{documentId}",
		});
	}

	public Task<StartSignatureResponse> StartPublicSignatureAsync(string key, PublicStartSignatureRequest request) {
		var documentId = Guid.Parse(key["key-".Length..]);
		Assert.Equal($"ticket+{documentId}", request.Ticket);
		if (StartErrors.TryGetValue(documentId, out var error)) {
			throw error;
		}
		var toSignHash = SHA256.HashData(documentId.ToByteArray());
		Started[key] = (request.Certificate, toSignHash);
		return Task.FromResult(new StartSignatureResponse {
			Success = true,
			ToSignHash = toSignHash,
			DigestAlgorithm = DigestAlgorithm,
			Token = $"token-{key}",
		});
	}

	public Task CompletePublicSignatureAsync(string key, CompleteSignatureRequest request) {
		Assert.Equal($"token-{key}", request.Token);
		Completed[key] = request.Signature;
		return Task.CompletedTask;
	}

	public static SignerApiException ApiError(SignerErrorCodes code, string message)
		=> new(HttpMethod.Post, new Uri("https://signer.test/api"), new ErrorModel { Code = code, Message = message });

	#region Document builders

	public static DocumentModel Document(string name, params FlowActionModel[] actions) => new() {
		Id = Guid.NewGuid(),
		Name = name,
		Status = DocumentStatus.Pending,
		CreationDate = new DateTimeOffset(2026, 10, 1, 12, 0, 0, TimeSpan.Zero),
		Folder = new FolderInfoModel { Id = Guid.NewGuid(), Name = "Contracts" },
		FlowActions = actions.ToList(),
	};

	public static FlowActionModel SignerAction(string? cpf, string? email, ActionStatus status = ActionStatus.Pending, int step = 1) => new() {
		Id = Guid.NewGuid(),
		Type = FlowActionType.Signer,
		Status = status,
		Step = step,
		User = new ParticipantUserModel { Name = "Participant", Identifier = cpf, Email = email },
	};

	public static FlowActionModel ApproverAction(string? cpf, string? email) => new() {
		Id = Guid.NewGuid(),
		Type = FlowActionType.Approver,
		Status = ActionStatus.Pending,
		Step = 1,
		User = new ParticipantUserModel { Name = "Approver", Identifier = cpf, Email = email },
	};

	public static FlowActionModel SignRuleAction(params SignRuleUserModel[] users) => new() {
		Id = Guid.NewGuid(),
		Type = FlowActionType.SignRule,
		Status = ActionStatus.Pending,
		Step = 1,
		SignRuleUsers = users.ToList(),
	};

	public static SignRuleUserModel RuleUser(string? cpf, string? email, bool signed = false) => new() {
		Id = Guid.NewGuid(),
		Name = "Rule user",
		Identifier = cpf,
		Email = email,
		SignatureDate = signed ? DateTimeOffset.UtcNow : null,
	};

	#endregion
}
