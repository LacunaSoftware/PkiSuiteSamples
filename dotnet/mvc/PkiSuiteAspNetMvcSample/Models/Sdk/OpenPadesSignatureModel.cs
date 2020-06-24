using Lacuna.Pki.Pades;
using PkiSuiteAspNetMvcSample.Models.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PkiSuiteAspNetMvcSample.Models.Sdk {
	public class OpenPadesSignatureModel {
		public string File { get; set; }
		public PadesSignatureModel Signature { get; set; }
	}
}