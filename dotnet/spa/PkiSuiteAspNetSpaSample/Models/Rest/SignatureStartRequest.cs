using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PkiSuiteAspNetSpaSample.Models.Rest {
	public class SignatureStartRequest {

		public string UserFile { get; set; }
		public bool IsCmsCosign { get; set; }
	}
}
