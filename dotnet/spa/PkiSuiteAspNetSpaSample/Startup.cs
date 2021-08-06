using Lacuna.Pki;
using Lacuna.RestPki.Client;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using PkiSuiteAspNetSpaSample.Classes;
using PkiSuiteAspNetSpaSample.Models;
using System;

namespace PkiSuiteAspNetSpaSample {
	public class Startup {
		public Startup(IConfiguration configuration)
		{
			Configuration = configuration;
		}

		public IConfiguration Configuration { get; }

		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices(IServiceCollection services)
		{
			services.Configure<RestPkiConfig>(Configuration.GetSection("RestPki"));
			services.Configure<RestPkiCoreConfig>(Configuration.GetSection("RestPkiCore"));
			services.Configure<WebPkiConfig>(Configuration.GetSection("WebPki"));

			services.AddControllersWithViews();
			// In production, the Angular files will be served from this directory
			services.AddSpaStaticFiles(configuration =>
			{
				configuration.RootPath = "ClientApp/dist";
			});

			services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
			services.AddSingleton<StorageMock>();
			services.AddSingleton<Util>();
			services.AddSingleton<PadesVisualElements>();
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
		{
			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();
			}
			else
			{
				app.UseExceptionHandler("/Error");
				// The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
				app.UseHsts();
			}

			app.UseHttpsRedirection();
			app.UseStaticFiles();
			if (!env.IsDevelopment())
			{
				app.UseSpaStaticFiles();
			}

			app.UseRouting();

			app.UseEndpoints(endpoints => {
				endpoints.MapControllerRoute(
					name: "default",
					pattern: "/",
					defaults: new { controller = "Home", action = "Index" }
				);
				endpoints.MapControllerRoute(
					name: "spa",
					pattern: "/RedirectToSPA",
					defaults: new { controller = "Home", action = "RedirectToSPA" }
				);
				endpoints.MapControllerRoute(
					name: "restpkitoken",
					pattern: "/CheckRestPkiToken",
					defaults: new { controller = "Home", action = "CheckRestPkiToken" }
				);
			});

			app.UseSpaStaticFiles();

			app.UseSpa(spa =>
			{
				// To learn more about options for serving an Angular SPA from ASP.NET Core,
				// see https://go.microsoft.com/fwlink/?linkid=864501

				spa.Options.SourcePath = "ClientApp";

				if (env.IsDevelopment())
				{
					spa.UseAngularCliServer(npmScript: "start");
				}
			});
		}
	}
}
