using Lacuna.RestPki.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PkiSuiteAspNetSpaSample.Models.Rest {

	public enum SignatureAlgorithms {
		MD5WithRSA,
		SHA1WithRSA,
		SHA256WithRSA,
		SHA384WithRSA,
		SHA512WithRSA
	}

	public class SignatureAlgorithmAndValueModel {
		public SignatureAlgorithms AlgorithmIdentifier { get; set; }
		public byte[] Value { get; set; }
		public string HexValue { get; set; }

		public SignatureAlgorithmAndValueModel(SignatureAlgorithmAndValue signature) {

			Value = signature.Value;
			if (Value != null) {
				HexValue = string.Join("", Value.Select(b => b.ToString("X2")));
			}

			if (signature.Algorithm == SignatureAlgorithm.MD5WithRSA) {
				AlgorithmIdentifier = SignatureAlgorithms.MD5WithRSA;
			} else if (signature.Algorithm == SignatureAlgorithm.SHA1WithRSA) {
				AlgorithmIdentifier = SignatureAlgorithms.SHA1WithRSA;
			} else if (signature.Algorithm == SignatureAlgorithm.SHA256WithRSA) {
				AlgorithmIdentifier = SignatureAlgorithms.SHA256WithRSA;
			} else if (signature.Algorithm == SignatureAlgorithm.SHA384WithRSA) {
				AlgorithmIdentifier = SignatureAlgorithms.SHA384WithRSA;
			} else if (signature.Algorithm == SignatureAlgorithm.SHA512WithRSA) {
				AlgorithmIdentifier = SignatureAlgorithms.SHA512WithRSA;
			}
		}
	}
}