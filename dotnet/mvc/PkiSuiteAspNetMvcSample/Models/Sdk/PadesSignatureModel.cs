using Lacuna.Pki;
using Lacuna.Pki.Cades;
using Lacuna.Pki.Pades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PkiSuiteAspNetMvcSample.Models.Sdk {
	public class PadesSignatureModel {
		public List<PadesSignerModel> Signers { get; set; }

		public PadesSignatureModel(PadesSignature signature, IPadesPolicyMapperBySignerInfo policyMapper = null) {
			// Convert signers validating each one.
			Signers = signature.Signers.Select(s => {

				// Validate signature according to the provided policy.
				if (policyMapper != null) {
					var vr = signature.ValidateSignature(s, policyMapper);
					return new PadesSignerModel(s) {
						ValidationResults = new ValidationResultsModel(vr)
					};
				}
				return new PadesSignerModel(s);

			}).ToList();
		}

	}

	public class PadesSignerModel {

		public DigestAlgorithmAndValueModel MessageDigest { get; set; }
		public SignatureAlgorithmAndValueModel Signature { get; set; }
		public SignaturePolicyIdentifierModel SignaturePolicy { get; set; }
		public CertificateModel Certificate { get; set; }
		public DateTimeOffset? SigningTime { get; set; }
		public DateTimeOffset? CertifiedDateReference { get; set; }
		public List<CadesTimestampModel> Timestamps { get; set; }
		public ValidationResultsModel ValidationResults { get; set; }

		public PadesSignerModel(PadesSignerInfo padesSigner) {
			var signer = padesSigner.Signer;
			SigningTime = signer.SigningTime;
			if (signer.DigestAlgorithm != null && signer.MessageDigest != null) {
				MessageDigest = new DigestAlgorithmAndValueModel(signer.DigestAlgorithm, signer.MessageDigest);
			}
			if (signer.SignatureAlgorithm != null && signer.SignatureValue != null) {
				Signature = new SignatureAlgorithmAndValueModel(signer.SignatureAlgorithm, signer.SignatureValue);
			}
			if (signer.SignaturePolicy != null && !signer.SignaturePolicy.IsImplicit) {
				SignaturePolicy = new SignaturePolicyIdentifierModel(signer.SignaturePolicy);
			}
			if (signer.SigningCertificate != null) {
				Certificate = new CertificateModel(signer.SigningCertificate);
			}
			if (signer.SignatureTimeStamps.Any()) {
				Timestamps = signer.SignatureTimeStamps.Select(s => new CadesTimestampModel(s)).ToList();
			}

			// Get date reference
			try {
				var dateReference = signer.GetDateReference(out bool isCertified);
				if (isCertified) {
					CertifiedDateReference = dateReference;
				}
			} catch {
				// do nothing
			}
		}
	}
}