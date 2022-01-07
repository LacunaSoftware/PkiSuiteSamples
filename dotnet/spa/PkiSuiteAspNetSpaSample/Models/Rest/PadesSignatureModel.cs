using Lacuna.RestPki.Client;
using PkiSuiteAspNetSpaSample.Classes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PkiSuiteAspNetSpaSample.Models.Rest {
	public class PadesSignatureModel {
		public List<PadesSignerModel> Signers { get; set; }

		public PadesSignatureModel(PadesSignature signature)
		{
			Signers = signature.Signers.ConvertAll<PadesSignerModel>(signer => new PadesSignerModel(signer));
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

		public PadesSignerModel(PadesSignerInfo padesSigner)
		{
			var signer = padesSigner;
			SigningTime = signer.SigningTime;
			ValidationResults = signer.ValidationResults.ToModel();
			CertifiedDateReference = signer.CertifiedDateReference;
			if (signer.MessageDigest != null)
			{
				MessageDigest = new DigestAlgorithmAndValueModel(signer.MessageDigest);
			}
			if (signer.Signature!= null)
			{
				Signature = new SignatureAlgorithmAndValueModel(signer.Signature);
			}
			if (signer.SignaturePolicy != null)
			{
				SignaturePolicy = new SignaturePolicyIdentifierModel(signer.SignaturePolicy);
			}
			if (signer.Certificate != null)
			{
				Certificate = new CertificateModel(signer.Certificate);
			}
			if (signer.Timestamps.Any())
			{
				Timestamps = signer.Timestamps.Select(s => new CadesTimestampModel(s)).ToList();
			}
		}
	}
}
