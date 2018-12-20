using Lacuna.RestPki.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PkiSuiteAspNetMvcSample.Models.RestPki {
	public class OpenPadesSignatureModel {
		public string File { get; set; }
		public PadesSignature Signature { get; set; }
	}
}