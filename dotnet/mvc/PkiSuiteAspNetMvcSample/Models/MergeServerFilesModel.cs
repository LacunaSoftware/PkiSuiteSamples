using PkiSuiteAspNetMvcSample.Classes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PkiSuiteAspNetMvcSample.Models
{
	public class MergeServerFilesModel : RedirectModel
	{
		public MergeServerFileModel[] AvailableFiles { get; set; }
		public int ChosenCombination { get; set; }
		public SampleDocs DataFile { get; set; }
	}

	public class MergeServerFileModel
	{
		public SampleDocs File1 { get; set; }
		public SampleDocs File2 { get; set; }
		public string Description { get; set; }
	}
}