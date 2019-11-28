using Lacuna.Pki;
using Lacuna.Pki.Cades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PkiSuiteAspNetMvcSample.Models.Sdk {

	public enum CmsContentTypes {
		Data,
		SignedData,
		EnvelopedData,
		DigestedData,
		EncryptedData,
		AuthenticatedData,
		TstInfo
	}

	public class CadesSignatureModel {

		public CmsContentTypes EncapsulatedContentType { get; set; }
		public bool HasEncapsulatedContent { get; set; }
		public List<CadesSignerModel> Signers { get; set; }
		public byte[] EncapsulatedContent { get; set; }

		public CadesSignatureModel(CadesSignature signature, ICadesPolicyMapperBySignerInfo policyMapper = null) {
			HasEncapsulatedContent = signature.HasEncapsulatedContent;
			EncapsulatedContent = signature.GetEncapsulatedContent();

			// Convert signers validating each one.
			Signers = signature.Signers.Select(s => {

				// Validate signature according to the provided policy.
				if (policyMapper != null) {
					var vr = signature.ValidateSignature(s, policyMapper);
					return new CadesSignerModel(s) {
						ValidationResults = new ValidationResultsModel(vr)
					};
				}
				return new CadesSignerModel(s);

			}).ToList();

			var contentType = signature.EncapsulatedContentType;
			if (contentType == CmsContentType.Data) {
				EncapsulatedContentType = CmsContentTypes.Data;
			} else if (contentType == CmsContentType.SignedData) {
				EncapsulatedContentType = CmsContentTypes.SignedData;
			} else if (contentType == CmsContentType.DigestedData) {
				EncapsulatedContentType = CmsContentTypes.DigestedData;
			} else if (contentType == CmsContentType.EncryptedData) {
				EncapsulatedContentType = CmsContentTypes.EncryptedData;
			} else if (contentType == CmsContentType.AuthenticatedData) {
				EncapsulatedContentType = CmsContentTypes.AuthenticatedData;
			} else if (contentType == CmsContentType.TstInfo) {
				EncapsulatedContentType = CmsContentTypes.TstInfo;
			}

		}
	}

	public class CadesTimestampModel : CadesSignatureModel {

		public DateTimeOffset GenTime { get; set; }
		public string SerialNumber { get; set; }
		public DigestAlgorithmAndValueModel MessageImprint { get; set; }


		public CadesTimestampModel(CadesTimestamp signature) : base(signature) {
			GenTime = signature.GenTime;
			if (signature.TstInfo.SerialNumber != null) {
				SerialNumber = signature.TstInfo.SerialNumber.ToString();
			}
			if (signature.TstInfo.MessageImprint != null) {
				MessageImprint = new DigestAlgorithmAndValueModel(signature.TstInfo.MessageImprint);
			}
		}
	}

	public class CadesSignerModel {

		public DigestAlgorithmAndValueModel MessageDigest { get; set; }
		public SignatureAlgorithmAndValueModel Signature { get; set; }
		public SignaturePolicyIdentifierModel SignaturePolicy { get; set; }
		public CertificateModel Certificate { get; set; }
		public DateTimeOffset? SigningTime { get; set; }
		public DateTimeOffset? CertifiedDateReference { get; set; }
		public List<CadesTimestampModel> Timestamps { get; set; }
		public ValidationResultsModel ValidationResults { get; set; }

		public CadesSignerModel(CadesSignerInfo signer) {

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
				bool isCertified;
				var dateReference = signer.GetDateReference(out isCertified);
				if (isCertified) {
					CertifiedDateReference = dateReference;
				}
			} catch {
				// do nothing
			}
		}
	}
}