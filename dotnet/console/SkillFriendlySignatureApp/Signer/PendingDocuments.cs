using Lacuna.Signer.Api;
using Lacuna.Signer.Api.Documents;
using Lacuna.Signer.Api.FlowActions;
using Lacuna.Spa.Api;

namespace SkillFriendlySignatureApp.Signer;

/// <summary>
/// A pending document as `list` prints it.
/// </summary>
public record PendingDocument(Guid Id, string Name, DateTimeOffset CreatedAt, string? Folder, Guid FlowActionId, FlowActionType ActionType, int Step);

/// <summary>
/// The flow action a participant has to sign, and the Signer user it was found under (the action's
/// user, or one of a sign rule's users).
/// </summary>
public record PendingAction(FlowActionModel Action, string? Identifier, string? Email);

/// <summary>
/// A pending document is a Signer document that a given participant can sign with a certificate
/// right now. A document awaiting the participant's approval, or one where the participant's turn
/// has not come yet, is not pending for them.
/// </summary>
public static class PendingDocuments {

	private const int PageSize = 50;
	private const int MaxConcurrentDetails = 4;

	/// <summary>
	/// Lists every pending document of the participant, in all pages.
	/// </summary>
	public static async Task<List<PendingDocument>> ListAsync(ISignerGateway signer, Participant participant, CancellationToken cancellationToken) {

		// The list narrows the documents down to pending ones in which the participant takes part.
		// It cannot say whether it is the participant's turn: "pending for this participant"
		// (ParticipantSituation) arrives only in Signer 3.0, and the list items have no flow
		// actions. So each candidate's details decide, below.
		var candidates = new List<DocumentListModel>();
		for (var offset = 0; ; offset += PageSize) {
			var page = await signer.ListDocumentsAsync(new DocumentListParameters {
				Status = DocumentFilterStatus.Pending,
				FilterByPendingSignature = true,
				ParticipantQ = participant.Cpf ?? participant.Email,
				ParticipantQueryType = participant.Cpf != null ? ParticipantQueryTypes.Identifier : ParticipantQueryTypes.Email,
				Limit = PageSize,
				Offset = offset,
				Order = PaginationOrders.Desc,
			});
			var items = page.Items?.ToList() ?? [];
			candidates.AddRange(items);
			if (items.Count < PageSize || candidates.Count >= page.TotalCount) {
				break;
			}
		}

		var pending = new PendingDocument?[candidates.Count];
		var options = new ParallelOptions { MaxDegreeOfParallelism = MaxConcurrentDetails, CancellationToken = cancellationToken };
		await Parallel.ForEachAsync(Enumerable.Range(0, candidates.Count), options, async (i, _) => {
			var document = await signer.GetDocumentDetailsAsync(candidates[i].Id);
			if (FindPendingAction(document, participant) is { } found) {
				pending[i] = new PendingDocument(document.Id, document.Name, document.CreationDate, document.Folder?.Name, found.Action.Id, found.Action.Type, found.Action.Step);
			}
		});
		return pending.OfType<PendingDocument>().ToList();
	}

	/// <summary>
	/// The action the participant can sign in this document now, or null. Approvals are left out
	/// (they need no certificate), and so are actions whose step has not started (status Created).
	/// </summary>
	public static PendingAction? FindPendingAction(DocumentModel document, Participant participant) {
		if (document.Status != DocumentStatus.Pending || document.IsDeleted) {
			return null;
		}
		foreach (var action in document.FlowActions ?? []) {
			if (action.Status != ActionStatus.Pending) {
				continue;
			}
			if (action.Type == FlowActionType.Signer && action.User != null && participant.Matches(action.User.Identifier, action.User.Email)) {
				return new PendingAction(action, action.User.Identifier, action.User.Email);
			}
			if (action.Type == FlowActionType.SignRule) {
				// A sign rule stays pending until enough of its users sign, so skip a user who
				// already signed or refused.
				var user = action.SignRuleUsers?.FirstOrDefault(u => u.SignatureDate == null && !u.HasRefused && participant.Matches(u.Identifier, u.Email));
				if (user != null) {
					return new PendingAction(action, user.Identifier, user.Email);
				}
			}
		}
		return null;
	}

	/// <summary>
	/// Whether the participant has signed the given flow action: a signer action is completed, or
	/// the participant's user in a sign rule has a signature date.
	/// </summary>
	public static bool HasSigned(DocumentModel document, Guid flowActionId, Participant participant) {
		var action = document.FlowActions?.FirstOrDefault(a => a.Id == flowActionId);
		return action?.Type switch {
			FlowActionType.Signer => action.Status == ActionStatus.Completed,
			FlowActionType.SignRule => action.SignRuleUsers?.Any(u => u.SignatureDate != null && participant.Matches(u.Identifier, u.Email)) == true,
			_ => false,
		};
	}
}
