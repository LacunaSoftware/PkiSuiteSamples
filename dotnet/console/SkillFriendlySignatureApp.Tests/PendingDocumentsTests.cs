using Lacuna.Signer.Api;
using SkillFriendlySignatureApp.Signer;
using SkillFriendlySignatureApp.Tests.TestSupport;
using static SkillFriendlySignatureApp.Tests.TestSupport.FakeSignerGateway;

namespace SkillFriendlySignatureApp.Tests;

public class PendingDocumentsTests {

	private const string Cpf = TestCertificates.PierreCpf;
	private const string OtherCpf = "56072386105";
	private static readonly Participant ByCpf = new(Cpf, null);

	[Fact]
	public void A_pending_signer_action_of_the_participant_is_pending() {
		var action = SignerAction(Cpf, "pierre@example.com");
		var found = PendingDocuments.FindPendingAction(Document("Contract", action), ByCpf);

		Assert.NotNull(found);
		Assert.Equal(action.Id, found.Action.Id);
		Assert.Equal("pierre@example.com", found.Email);
	}

	[Fact]
	public void An_approval_is_not_pending_signature() {
		Assert.Null(PendingDocuments.FindPendingAction(Document("Contract", ApproverAction(Cpf, null)), ByCpf));
	}

	[Theory]
	[InlineData(ActionStatus.Created)]    // the participant's step has not started
	[InlineData(ActionStatus.Completed)]  // already signed
	[InlineData(ActionStatus.Refused)]
	public void An_action_that_is_not_pending_is_not_pending(ActionStatus status) {
		Assert.Null(PendingDocuments.FindPendingAction(Document("Contract", SignerAction(Cpf, null, status)), ByCpf));
	}

	[Fact]
	public void Another_participants_action_is_not_pending_for_this_one() {
		Assert.Null(PendingDocuments.FindPendingAction(Document("Contract", SignerAction(OtherCpf, null)), ByCpf));
	}

	[Theory]
	[InlineData(DocumentStatus.Canceled)]
	[InlineData(DocumentStatus.Expired)]
	[InlineData(DocumentStatus.Refused)]
	public void A_document_that_is_not_pending_has_no_pending_action(DocumentStatus status) {
		var document = Document("Contract", SignerAction(Cpf, null));
		document.Status = status;

		Assert.Null(PendingDocuments.FindPendingAction(document, ByCpf));
	}

	[Fact]
	public void A_sign_rule_is_pending_for_a_user_who_has_not_signed_yet() {
		var document = Document("Contract", SignRuleAction(RuleUser(OtherCpf, null), RuleUser(Cpf, "pierre@example.com")));

		Assert.Equal("pierre@example.com", PendingDocuments.FindPendingAction(document, ByCpf)?.Email);
	}

	[Fact]
	public void A_sign_rule_is_not_pending_for_a_user_who_already_signed() {
		var document = Document("Contract", SignRuleAction(RuleUser(Cpf, null, signed: true), RuleUser(OtherCpf, null)));

		Assert.Null(PendingDocuments.FindPendingAction(document, ByCpf));
	}

	[Fact]
	public void A_sign_rule_is_not_pending_for_a_user_who_refused() {
		var document = Document("Contract", SignRuleAction(RuleUser(Cpf, null, refused: true), RuleUser(OtherCpf, null)));

		Assert.Null(PendingDocuments.FindPendingAction(document, ByCpf));
	}

	[Fact]
	public void HasSigned_reads_a_completed_signer_action_or_a_signed_rule_user() {
		var pendingAction = SignerAction(Cpf, null);
		var completedAction = SignerAction(Cpf, null, ActionStatus.Completed);
		var rule = SignRuleAction(RuleUser(Cpf, null, signed: true), RuleUser(OtherCpf, null));
		var otherRule = SignRuleAction(RuleUser(Cpf, null), RuleUser(OtherCpf, null, signed: true));
		var document = Document("Contract", pendingAction, completedAction, rule, otherRule);

		Assert.False(PendingDocuments.HasSigned(document, pendingAction.Id, ByCpf));
		Assert.True(PendingDocuments.HasSigned(document, completedAction.Id, ByCpf));
		Assert.True(PendingDocuments.HasSigned(document, rule.Id, ByCpf));
		Assert.False(PendingDocuments.HasSigned(document, otherRule.Id, ByCpf));
		Assert.False(PendingDocuments.HasSigned(document, Guid.NewGuid(), ByCpf));
	}

	[Fact]
	public void A_participant_known_by_email_finds_an_action_without_cpf() {
		var document = Document("Contract", SignerAction(null, "pierre@example.com"));

		Assert.NotNull(PendingDocuments.FindPendingAction(document, new Participant(null, "pierre@example.com")));
	}

	[Fact]
	public async Task ListAsync_reads_every_page_and_keeps_only_pending_documents() {
		var signer = new FakeSignerGateway();
		for (var i = 0; i < 120; i++) {
			// Every third document is the participant's; the others belong to someone else.
			signer.Add(Document($"Document {i}", SignerAction(i % 3 == 0 ? Cpf : OtherCpf, null)));
		}

		var documents = await PendingDocuments.ListAsync(signer, ByCpf, TestContext.Current.CancellationToken);

		Assert.Equal(40, documents.Count);
		Assert.Equal(Enumerable.Range(0, 40).Select(i => $"Document {i * 3}"), documents.Select(d => d.Name));
		Assert.Equal([0, 50, 100], signer.ListRequests.Select(r => r.Offset));
		Assert.All(signer.ListRequests, r => {
			Assert.Equal(DocumentFilterStatus.Pending, r.Status);
			Assert.Equal(Cpf, r.ParticipantQ);
			Assert.Equal(ParticipantQueryTypes.Identifier, r.ParticipantQueryType);
		});
	}

	[Fact]
	public async Task ListAsync_queries_by_email_for_a_participant_known_by_email() {
		var signer = new FakeSignerGateway();

		await PendingDocuments.ListAsync(signer, new Participant(null, "pierre@example.com"), TestContext.Current.CancellationToken);

		Assert.Equal("pierre@example.com", signer.ListRequests.Single().ParticipantQ);
		Assert.Equal(ParticipantQueryTypes.Email, signer.ListRequests.Single().ParticipantQueryType);
	}
}
