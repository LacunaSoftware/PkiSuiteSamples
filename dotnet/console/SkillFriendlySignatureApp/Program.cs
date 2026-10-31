using System.Text;
using Microsoft.Extensions.Configuration;
using SkillFriendlySignatureApp;
using SkillFriendlySignatureApp.Certificates;
using SkillFriendlySignatureApp.Signer;

// Settings: appsettings.json next to the executable, then user secrets, then environment
// variables (Signer__ApiKey, Signer__Endpoint, PkiSdk__License). Never command-line flags, so the
// API key never appears in the commands an agent writes, or in its transcript.
var configuration = new ConfigurationBuilder()
	.SetBasePath(AppContext.BaseDirectory)
	.AddJsonFile("appsettings.json", optional: true)
	.AddUserSecrets(typeof(Program).Assembly, optional: true)
	.AddEnvironmentVariables()
	.Build();

// Document and certificate names have accents.
Console.OutputEncoding = Encoding.UTF8;

var services = new CliServices(
	Console.Out,
	Console.Error,
	() => SignerGateway.Create(configuration),
	() => {
		PkiSdkLicense.Load(configuration);
		return new WindowsCertificateSource();
	},
	TimeProvider.System
);

return await Cli.RunAsync(args, services);
