using Lacuna.Pki.Cades;
using Lacuna.Pki.Xml;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PkiSuiteAspNetSpaSample.Models.Sdk {
	public class SignaturePolicyIdentifierModel {
		public string Oid { get; set; }
		public DigestAlgorithmAndValueModel Hash { get; set; }
		public string Uri { get; set; }

		public SignaturePolicyIdentifierModel(XmlPolicyIdentifier identifier) {
			Oid = identifier.SigPolicyId;
			Uri = identifier.SigPolicyUri;
			if (identifier.SigPolicyHash != null) {
				Hash = new DigestAlgorithmAndValueModel(identifier.SigPolicyHash);
			}
		}

		public SignaturePolicyIdentifierModel(CadesSignaturePolicyInfo policyInfo) {
			Oid = policyInfo.Oid;
			Uri = policyInfo.Uri?.ToString();
			if (policyInfo.Digest != null) {
				Hash = new DigestAlgorithmAndValueModel(policyInfo.Digest);
			}
		}
	}
}