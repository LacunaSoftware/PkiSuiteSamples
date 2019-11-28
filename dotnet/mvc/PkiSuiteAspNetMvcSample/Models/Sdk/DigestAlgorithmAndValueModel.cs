using Lacuna.Pki;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PkiSuiteAspNetMvcSample.Models.Sdk {

	public enum DigestAlgorithms {
		MD5 = 1,
		SHA1,
		SHA256,
		SHA384,
		SHA512
	}

	public class DigestAlgorithmAndValueModel {

		public DigestAlgorithms Algorithm { get; set; }
		public byte[] Value { get; set; }
		public string HexValue { get; set; }

		public DigestAlgorithmAndValueModel(DigestAlgorithmAndValue dv) : this(dv.Algorithm, dv.Value) {
		}

		public DigestAlgorithmAndValueModel(DigestAlgorithm digest, byte[] value) {

			Value = value;
			if (value != null) {
				HexValue = string.Join("", value.Select(b => b.ToString("X2")));
			}

			if (digest == DigestAlgorithm.MD5) {
				Algorithm = DigestAlgorithms.MD5;
			} else if (digest == DigestAlgorithm.SHA1) {
				Algorithm = DigestAlgorithms.SHA1;
			} else if (digest == DigestAlgorithm.SHA256) {
				Algorithm = DigestAlgorithms.SHA256;
			} else if (digest == DigestAlgorithm.SHA384) {
				Algorithm = DigestAlgorithms.SHA384;
			} else if (digest == DigestAlgorithm.SHA512) {
				Algorithm = DigestAlgorithms.SHA512;
			}
		}
	}
}