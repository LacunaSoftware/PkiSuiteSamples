using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PkiSuiteAspNetMvcSample.Controllers {
	public class BaseController : Controller {

		protected void SetNoCacheHeaders() {
			Response.Cache.SetCacheability(HttpCacheability.NoCache);
			Response.Cache.SetNoStore();
			Response.Expires = -1;
			Response.AddHeader("Last-Modified", DateTimeOffset.UtcNow.ToString("R"));
		}

		protected override void OnException(ExceptionContext filterContext) {
			filterContext.ExceptionHandled = true;

			var controller = filterContext.RouteData.Values["controller"] as string;
			var action = filterContext.RouteData.Values["action"] as string;
			var model = new HandleErrorInfo(filterContext.Exception, controller, action);

			filterContext.Result = new ViewResult() {
				ViewName = "~/Views/Shared/Error.cshtml",
				ViewData = new ViewDataDictionary<HandleErrorInfo>(model)
			};
		}
	}
}