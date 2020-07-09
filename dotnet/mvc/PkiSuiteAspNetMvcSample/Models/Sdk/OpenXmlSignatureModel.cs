using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PkiSuiteAspNetMvcSample.Models.Sdk {

	public class OpenXmlSignatureModel {
		public string File { get; set; }
		public List<XmlSignatureModel> Signatures { get; set; }
	}
}