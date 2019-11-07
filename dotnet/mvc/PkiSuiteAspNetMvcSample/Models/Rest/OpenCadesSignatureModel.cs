using Lacuna.RestPki.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PkiSuiteAspNetMvcSample.Models.Rest {
	public class OpenCadesSignatureModel {
		public string File { get; set; }
		public CadesSignature Signature { get; set; }
	}
}