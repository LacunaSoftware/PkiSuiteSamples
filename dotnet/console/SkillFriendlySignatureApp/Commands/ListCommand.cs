using System.CommandLine;
using SkillFriendlySignatureApp.Signer;

namespace SkillFriendlySignatureApp.Commands;

/// <summary>
/// `list --cpf <cpf>` or `list --email <email>`: the participant's pending documents.
/// </summary>
public static class ListCommand {

	public static Command Create(CliServices services) {
		var cpfOption = new Option<string>("--cpf") { Description = "The participant's CPF, with or without punctuation." };
		var emailOption = new Option<string>("--email") { Description = "The participant's email address." };

		var command = new Command("list", "Lists the documents the participant can sign with a certificate now. Give either --cpf or --email.") {
			cpfOption,
			emailOption,
		};
		command.Validators.Add(result => {
			if ((result.GetResult(cpfOption) == null) == (result.GetResult(emailOption) == null)) {
				result.AddError("Give exactly one of --cpf and --email.");
			}
		});

		command.SetAction((parseResult, cancellationToken) => Cli.RunCommandAsync(services, async () => {
			var cpf = parseResult.GetValue(cpfOption);
			var participant = cpf != null ? Participant.ByCpf(cpf) : Participant.ByEmail(parseResult.GetRequiredValue(emailOption));

			var documents = await PendingDocuments.ListAsync(services.CreateSignerGateway(), participant, cancellationToken);

			object result = new {
				participant = new { cpf = participant.Cpf, email = participant.Email },
				totalCount = documents.Count,
				documents,
			};
			return (result, ExitCodes.Success);
		}));
		return command;
	}
}
