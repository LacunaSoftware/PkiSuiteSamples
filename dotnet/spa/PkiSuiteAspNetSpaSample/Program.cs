using Lacuna.Pki;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace PkiSuiteAspNetSpaSample {
	public class Program {
		public static void Main(string[] args)
		{
			var webHost = CreateWebHostBuilder(args).Build();

			PkiConfig.LoadLicense("LacunaPkiLicense.config");

			webHost.Run();
		}

		public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
			WebHost.CreateDefaultBuilder(args).UseStartup<Startup>();
	}
}
