using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Formatting;
using System.Web.Http;

namespace PkiSuiteAspNetMvcSample {
	public static class WebApiConfig {
		public static void Register(HttpConfiguration config) {
			config.MapHttpAttributeRoutes();

			config.Routes.MapHttpRoute(
				 name: "DefaultApi",
				 routeTemplate: "api/{controller}/{action}/{id}",
				 defaults: new { id = RouteParameter.Optional }
			);

			// Configure camel case json formatting
			var jsonFormatter = config.Formatters.OfType<JsonMediaTypeFormatter>().First();
			jsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
		}
	}
}
