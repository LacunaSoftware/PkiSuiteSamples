using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PkiSuiteAspNetMvcSample.Models {
	public class SampleLinkModel {

		public string Module { get; set; }
		public string Action { get; set; }
		public string Controller { get; set; }
		public object RouteParameters { get; set; }

		public SampleLinkModel(
			string module,  
			string action, 
			string controller, 
			object routeParameters = null
		) {
			Module = module;
			Action = action;
			Controller = controller;
			RouteParameters = routeParameters;
		}
	}
}