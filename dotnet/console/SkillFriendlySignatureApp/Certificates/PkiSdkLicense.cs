using Lacuna.Pki;
using Microsoft.Extensions.Configuration;

namespace SkillFriendlySignatureApp.Certificates;

public static class PkiSdkLicense {

	public const string FileName = "LacunaPkiLicense.config";

	/// <summary>
	/// Loads the PKI SDK license, which PKI SDK needs before it reads a certificate. PkiSdk:License
	/// (for example the PkiSdk__License environment variable) holds a Base64 license and wins;
	/// otherwise the app loads LacunaPkiLicense.config from the folder of the executable.
	/// </summary>
	public static void Load(IConfiguration configuration) {
		var base64 = configuration["PkiSdk:License"];
		if (!string.IsNullOrWhiteSpace(base64)) {
			byte[] license;
			try {
				license = Convert.FromBase64String(base64.Trim());
			} catch (FormatException) {
				throw new AppException(ErrorCodes.InvalidPkiSdkLicense, "PkiSdk:License is not valid Base64.", ExitCodes.Configuration);
			}
			LoadFrom("PkiSdk:License", () => LoadBase64Content(license));
			return;
		}

		var path = Path.Combine(AppContext.BaseDirectory, FileName);
		if (!File.Exists(path)) {
			throw new AppException(ErrorCodes.MissingPkiSdkLicense, $"No PKI SDK license: set PkiSdk:License (or the PkiSdk__License environment variable) to a Base64 license, or put {FileName} next to the executable.", ExitCodes.Configuration);
		}
		LoadFrom(path, () => PkiConfig.LoadLicense(path));
	}

	/// <summary>
	/// PKI SDK decodes the license before it validates it, so a malformed license throws a format,
	/// XML or stream exception rather than a LicenseException. Report all of them as an invalid
	/// license, naming where it came from.
	/// </summary>
	private static void LoadFrom(string source, Action load) {
		try {
			load();
		} catch (Exception ex) {
			throw new AppException(ErrorCodes.InvalidPkiSdkLicense, $"Could not load the PKI SDK license from {source}: {ex.Message}", ExitCodes.Configuration);
		}
	}

	/// <summary>
	/// Lacuna sends a license in two forms: binary (usually as Base64) and the XML file
	/// LacunaPkiLicense.config. PkiSdk:License may hold the Base64 of either. PKI SDK loads the
	/// binary form from memory, but the XML form only from a file.
	/// </summary>
	private static void LoadBase64Content(byte[] license) {
		var isXml = System.Text.Encoding.UTF8.GetString(license).TrimStart('﻿', ' ', '\t', '\r', '\n').StartsWith('<');
		if (!isXml) {
			PkiConfig.LoadLicense(license);
			return;
		}
		var path = Path.Combine(Path.GetTempPath(), $"{Guid.NewGuid()}.config");
		try {
			File.WriteAllBytes(path, license);
			PkiConfig.LoadLicense(path);
		} finally {
			try {
				File.Delete(path);
			} catch (IOException) {
				// A leftover temporary file must not hide the license error, if there is one.
			}
		}
	}
}
