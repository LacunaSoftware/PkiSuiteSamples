namespace SkillFriendlySignatureApp.Tests;

public class CpfNumberTests {

	[Theory]
	[InlineData("473.633.618-86")]
	[InlineData("47363361886")]
	[InlineData(" 47363361886 ")]
	public void Parse_accepts_a_cpf_with_or_without_punctuation(string value) {
		Assert.Equal("47363361886", CpfNumber.Parse(value));
	}

	[Theory]
	[InlineData("47363361887")]   // wrong check digit
	[InlineData("4736336188")]    // 10 digits
	[InlineData("11111111111")]   // same digit 11 times: passes the check digits, but is not a CPF
	[InlineData("473a63361886")]
	[InlineData("")]
	public void Parse_rejects_an_invalid_cpf(string value) {
		var ex = Assert.Throws<AppException>(() => CpfNumber.Parse(value));
		Assert.Equal(ErrorCodes.InvalidCpf, ex.Code);
		Assert.Equal(ExitCodes.InvalidArguments, ex.ExitCode);
	}
}

public class ParticipantTests {

	[Fact]
	public void The_cpf_decides_when_both_have_one() {
		var participant = new Participant("47363361886", "pierre@example.com");

		Assert.True(participant.Matches("473.633.618-86", null));
		// Same email, other CPF: Signer would refuse the certificate (CpfMismatch).
		Assert.False(participant.Matches("56072386105", "pierre@example.com"));
	}

	[Fact]
	public void The_email_decides_when_the_user_has_no_cpf() {
		var participant = new Participant("47363361886", "pierre@example.com");

		Assert.True(participant.Matches(null, "Pierre@Example.com"));
		Assert.False(participant.Matches(null, "other@example.com"));
	}

	[Fact]
	public void A_participant_known_by_cpf_only_does_not_match_a_user_known_by_email_only() {
		Assert.False(new Participant("47363361886", null).Matches(null, "pierre@example.com"));
	}

	[Fact]
	public void ByEmail_rejects_an_invalid_address() {
		var ex = Assert.Throws<AppException>(() => Participant.ByEmail("not an email"));
		Assert.Equal(ErrorCodes.InvalidEmail, ex.Code);
	}
}
