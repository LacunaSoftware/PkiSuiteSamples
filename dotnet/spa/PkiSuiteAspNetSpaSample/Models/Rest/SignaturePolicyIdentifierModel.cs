using Lacuna.RestPki.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PkiSuiteAspNetSpaSample.Models.Rest {
	public class SignaturePolicyIdentifierModel {
		public string Oid { get; set; }
		public DigestAlgorithmAndValueModel Hash { get; set; }
		public string Uri { get; set; }

		public SignaturePolicyIdentifierModel(SignaturePolicyIdentifier identifier) {
			Oid = identifier.Oid;
			Uri = identifier.Uri;
			if (identifier.Digest!= null) {
				Hash = new DigestAlgorithmAndValueModel(identifier.Digest);
			}
		}
	}
}