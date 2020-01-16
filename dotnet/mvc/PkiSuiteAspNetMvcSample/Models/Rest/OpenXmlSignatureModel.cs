using Lacuna.RestPki.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PkiSuiteAspNetMvcSample.Models.Rest {

	public class OpenXmlSignatureModel {
		public string File { get; set; }
		public List<XmlSignature> Signatures { get; set; }
	}
}