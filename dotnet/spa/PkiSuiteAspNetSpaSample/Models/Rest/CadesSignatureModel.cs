using Api = Lacuna.RestPki.Api;
using Lacuna.RestPki.Client;
using PkiSuiteAspNetSpaSample.Classes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PkiSuiteAspNetSpaSample.Models.Rest {

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
		//public FileResultModel EncapsulatedContent { get; set; }

		public CadesSignatureModel(CadesSignature signature) {
			HasEncapsulatedContent = signature.HasEncapsulatedContent;

			// Convert signers validating each one.
			Signers = signature.Signers.Select(s => new CadesSignerModel(s)).ToList();

			var contentType = signature.EncapsulatedContentType;
			if (contentType == Api.CmsContentTypes.Data) {
				EncapsulatedContentType = CmsContentTypes.Data;
			} else if (contentType == Api.CmsContentTypes.SignedData) {
				EncapsulatedContentType = CmsContentTypes.SignedData;
			} else if (contentType == Api.CmsContentTypes.DigestedData) {
				EncapsulatedContentType = CmsContentTypes.DigestedData;
			} else if (contentType == Api.CmsContentTypes.EncryptedData) {
				EncapsulatedContentType = CmsContentTypes.EncryptedData;
			} else if (contentType == Api.CmsContentTypes.AuthenticatedData) {
				EncapsulatedContentType = CmsContentTypes.AuthenticatedData;
			} else if (contentType == Api.CmsContentTypes.TstInfo) {
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
			if (signature.SerialNumber != null) {
				SerialNumber = signature.SerialNumber.ToString();
			}
			if (signature.MessageImprint != null) {
				MessageImprint = new DigestAlgorithmAndValueModel(signature.MessageImprint);
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
			ValidationResults = signer.ValidationResults.ToModel();
			CertifiedDateReference = signer.CertifiedDateReference;
			if (signer.MessageDigest != null) {
				MessageDigest = new DigestAlgorithmAndValueModel(signer.MessageDigest);
			}
			if (signer.Signature != null) {
				Signature = new SignatureAlgorithmAndValueModel(signer.Signature);
			}
			if (signer.SignaturePolicy != null) {
				SignaturePolicy = new SignaturePolicyIdentifierModel(signer.SignaturePolicy);
			}
			if (signer.Certificate != null) {
				Certificate = new CertificateModel(signer.Certificate);
			}
			if (signer.Timestamps.Any()) {
				Timestamps = signer.Timestamps.Select(s => new CadesTimestampModel(s)).ToList();
			}
		}
	}
}