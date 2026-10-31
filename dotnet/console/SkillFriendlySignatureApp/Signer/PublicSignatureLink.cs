using System.Text.RegularExpressions;
using Lacuna.Signer.Api.Documents;

namespace SkillFriendlySignatureApp.Signer;

/// <summary>
/// The "key" (identifies the document's public signature) and "ticket" (authorizes it) in the
/// action URL Signer returns, such as https://www.dropsigner.com/document/key/{key}/sign?ticket={ticket}.
/// The public signature endpoints take them instead of a signed-in Signer user.
/// </summary>
public partial record PublicSignatureLink(string Key, string Ticket) {

	[GeneratedRegex("/key/([^/?#]+)")]
	private static partial Regex KeyPattern();

	[GeneratedRegex("[?&]ticket=([^&#]+)")]
	private static partial Regex TicketPattern();

	public static PublicSignatureLink Parse(ActionUrlResponse response) {
		foreach (var url in new[] { response.Url, response.EmbedUrl }) {
			if (string.IsNullOrEmpty(url)) {
				continue;
			}
			var key = KeyPattern().Match(url);
			var ticket = TicketPattern().Match(url);
			if (key.Success && ticket.Success) {
				return new PublicSignatureLink(Uri.UnescapeDataString(key.Groups[1].Value), Uri.UnescapeDataString(ticket.Groups[1].Value));
			}
		}
		throw new AppException(ErrorCodes.InvalidActionUrl, "Signer returned an action URL without a key and a ticket.", ExitCodes.Signer);
	}
}
