using System.Net.Mail;

namespace SkillFriendlySignatureApp;

/// <summary>
/// A person with a part to play in a Signer document's flow, identified by CPF, by email, or both.
/// </summary>
/// <param name="Cpf">The CPF, digits only, or null.</param>
/// <param name="Email">The email address, or null.</param>
public record Participant(string? Cpf, string? Email) {

	public static Participant ByCpf(string cpf) => new(CpfNumber.Parse(cpf), null);

	public static Participant ByEmail(string email) => new(null, ParseEmail(email));

	public static string ParseEmail(string email) {
		var trimmed = email.Trim();
		if (!MailAddress.TryCreate(trimmed, out var address) || address.Address != trimmed) {
			throw new AppException(ErrorCodes.InvalidEmail, $"'{email}' is not a valid email address.", ExitCodes.InvalidArguments);
		}
		return trimmed;
	}

	/// <summary>
	/// Whether a Signer user (a flow action's user, or a sign rule's user) is this participant.
	/// When both have a CPF, the CPF decides: Signer refuses a certificate whose CPF is not the
	/// user's (CpfMismatch), even when the email matches. Otherwise the email decides.
	/// </summary>
	public bool Matches(string? identifier, string? email) {
		var userCpf = CpfNumber.Digits(identifier);
		if (Cpf != null && userCpf.Length > 0) {
			return userCpf == Cpf;
		}
		return Email != null && email != null && string.Equals(Email, email.Trim(), StringComparison.OrdinalIgnoreCase);
	}
}

/// <summary>
/// The Brazilian individual taxpayer number (CPF): 11 digits, the last two of them check digits.
/// </summary>
public static class CpfNumber {

	public static string Digits(string? value) => new((value ?? "").Where(char.IsAsciiDigit).ToArray());

	/// <summary>
	/// Accepts a CPF with or without punctuation (123.456.789-09 or 12345678909) and returns its
	/// 11 digits, after checking the check digits.
	/// </summary>
	public static string Parse(string value) {
		var digits = Digits(value);
		var onlyCpfCharacters = value.Trim().All(c => char.IsAsciiDigit(c) || c == '.' || c == '-');
		if (!onlyCpfCharacters || !IsValid(digits)) {
			throw new AppException(ErrorCodes.InvalidCpf, $"'{value}' is not a valid CPF.", ExitCodes.InvalidArguments);
		}
		return digits;
	}

	public static bool IsValid(string digits) {
		if (digits.Length != 11 || !digits.All(char.IsAsciiDigit) || digits.Distinct().Count() == 1) {
			return false;
		}
		return digits[9] - '0' == CheckDigit(digits, 9) && digits[10] - '0' == CheckDigit(digits, 10);
	}

	private static int CheckDigit(string digits, int length) {
		var sum = 0;
		for (var i = 0; i < length; i++) {
			sum += (digits[i] - '0') * (length + 1 - i);
		}
		var remainder = sum % 11;
		return remainder < 2 ? 0 : 11 - remainder;
	}
}
