using System.CommandLine;
using SkillFriendlySignatureApp.Certificates;

namespace SkillFriendlySignatureApp.Commands;

/// <summary>
/// `certs`: the certificates `sign` can use. Each has a private key, is within its validity
/// period, and carries an ICP-Brasil CPF.
/// </summary>
public static class CertsCommand {

	public static Command Create(CliServices services) {
		var command = new Command("certs", "Lists the certificates in the Windows store (CurrentUser\\My) that can sign: with a private key, valid now, and carrying a CPF.");
		command.SetAction(_ => Cli.RunCommandAsync(services, () => {
			var certificates = LocalCertificates.ListUsable(services.CreateCertificateSource(), services.Time.GetUtcNow());
			object result = new {
				certificates = certificates.Select(c => new {
					thumbprint = c.Thumbprint,
					subjectName = c.Certificate.SubjectDisplayName,
					cpf = c.Cpf,
					issuerName = c.Certificate.IssuerDisplayName,
					notAfter = c.Certificate.ValidityEnd,
				}),
			};
			return Task.FromResult((result, ExitCodes.Success));
		}));
		return command;
	}
}
