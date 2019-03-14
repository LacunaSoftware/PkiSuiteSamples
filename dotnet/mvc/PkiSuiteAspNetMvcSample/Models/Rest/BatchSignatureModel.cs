using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PkiSuiteAspNetMvcSample.Models.Rest {
	public class BatchSignatureModel {
		public List<int> DocumentIds { get; set; }
	}
}