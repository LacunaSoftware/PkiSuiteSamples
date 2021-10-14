using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PkiSuiteAspNetSpaSample.Models.Sdk {
	public class AuthenticationStartResponse {
		public byte[] Nonce { get; set; }
		public string DigestAlgorithm { get; set; }
	}
}
