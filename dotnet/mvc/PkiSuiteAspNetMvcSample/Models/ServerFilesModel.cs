using PkiSuiteAspNetMvcSample.Classes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PkiSuiteAspNetMvcSample.Models {
	public class ServerFilesModel : RedirectModel {
		public bool IsCmsCoSign { get; set; }
		public ServerFileModel[] AvailableFiles { get; set; }
		public SampleDocs ChosenFileId { get; set; }
	}

	public class ServerFileModel {
		public SampleDocs Id { get; set; }
		public string Description { get; set; }

		public string DownloadUrl {
			get {
				return string.Format("/Download/Sample/{0}", Id);
			}
		}
	}
}