using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PkiSuiteAspNetMvcSample.Models.Sdk {
	public class PrescricaoDataModel {
		public string Name { get; set; }
		public string Crm { get; set; }
		public string CrmUf { get; set; }
		public string[] UFs { get; set; }
	}
}