using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PkiSuiteAspNetMvcSample.Models {
	public class ServerFilesModel : RedirectModel {
		public IEnumerable<int> AvailableFiles { get; set; }
		public int ChosenFile { get; set; }
	}
}