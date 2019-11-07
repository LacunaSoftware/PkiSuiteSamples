using Lacuna.Pki;
using Lacuna.Pki.Xml;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PkiSuiteAspNetMvcSample.Models.Sdk {

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

		public SignatureAlgorithmAndValueModel(SignatureAlgorithm sigAlgorithm, byte[] value) {

			Value = value;
			if (value != null) {
				HexValue = string.Join("", value.Select(b => b.ToString("X2")));
			}

			if (sigAlgorithm == SignatureAlgorithm.MD5WithRSA) {
				AlgorithmIdentifier = SignatureAlgorithms.MD5WithRSA;
			} else if (sigAlgorithm == SignatureAlgorithm.SHA1WithRSA) {
				AlgorithmIdentifier = SignatureAlgorithms.SHA1WithRSA;
			} else if (sigAlgorithm == SignatureAlgorithm.SHA256WithRSA) {
				AlgorithmIdentifier = SignatureAlgorithms.SHA256WithRSA;
			} else if (sigAlgorithm == SignatureAlgorithm.SHA384WithRSA) {
				AlgorithmIdentifier = SignatureAlgorithms.SHA384WithRSA;
			} else if (sigAlgorithm == SignatureAlgorithm.SHA512WithRSA) {
				AlgorithmIdentifier = SignatureAlgorithms.SHA512WithRSA;
			}
		}
	}
}