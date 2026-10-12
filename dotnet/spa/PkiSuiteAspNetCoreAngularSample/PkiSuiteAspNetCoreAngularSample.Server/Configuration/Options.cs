namespace PkiSuiteAspNetCoreAngularSample.Configuration;

/// <summary>
/// The "RestPkiCore" section of appsettings.json.
/// </summary>
public class RestPkiCoreOptions {

	public const string SectionName = "RestPkiCore";

	/// <summary>
	/// Rest PKI Core URL, with the trailing '/'. Change it only for an on-premises installation.
	/// </summary>
	public string Endpoint { get; set; } = "https://core.pki.rest/";

	/// <summary>
	/// Your Rest PKI Core API key.
	/// </summary>
	public string? ApiKey { get; set; }
}

/// <summary>
/// The "WebPki" section of appsettings.json.
/// </summary>
public class WebPkiOptions {

	public const string SectionName = "WebPki";

	/// <summary>
	/// Base64 Web PKI license, sent to the browser by GET /api/configuration. Web PKI needs no
	/// license on localhost.
	/// </summary>
	public string? License { get; set; }
}

/// <summary>
/// The "PkiSuite" section of appsettings.json: settings shared by every sample.
/// </summary>
public class PkiSuiteOptions {

	public const string SectionName = "PkiSuite";

	/// <summary>
	/// Whether to trust certificates issued by Lacuna's test PKI. It is true only in
	/// appsettings.Development.json. NEVER set it in production.
	/// </summary>
	public bool TrustLacunaTestRoot { get; set; }
}
