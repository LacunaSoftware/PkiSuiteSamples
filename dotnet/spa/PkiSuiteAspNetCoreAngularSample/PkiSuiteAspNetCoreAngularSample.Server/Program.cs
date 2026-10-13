using System.Text.Json.Serialization;
using Lacuna.Pki;
using PkiSuiteAspNetCoreAngularSample.Classes;
using PkiSuiteAspNetCoreAngularSample.Configuration;

var builder = WebApplication.CreateBuilder(args);

// Settings read by the samples (see appsettings.json and appsettings.json.example).
builder.Services.Configure<RestPkiCoreOptions>(builder.Configuration.GetSection(RestPkiCoreOptions.SectionName));
builder.Services.Configure<WebPkiOptions>(builder.Configuration.GetSection(WebPkiOptions.SectionName));
builder.Services.Configure<PkiSuiteOptions>(builder.Configuration.GetSection(PkiSuiteOptions.SectionName));

builder.Services.AddControllers()
	// Enums such as SampleDocument travel as their names, as the Angular app expects.
	.AddJsonOptions(options => options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
// Errors become application/problem+json responses, whose "detail" the Angular app displays.
builder.Services.AddProblemDetails();
builder.Services.AddHttpClient();

// Helpers shared by the samples.
builder.Services.AddSingleton<StorageMock>();
builder.Services.AddSingleton<Util>();
builder.Services.AddSingleton<PadesVisualElements>();

var app = builder.Build();

// PKI SDK needs its license before any of its classes is used.
PkiConfig.LoadLicense(Path.Combine(app.Environment.ContentRootPath, "LacunaPkiLicense.config"));

if (!app.Environment.IsDevelopment()) {
	app.UseExceptionHandler();
}

// The Angular app, built into wwwroot when this project is published. In Development, SpaProxy
// sends the browser to the Angular dev server instead, which forwards /api calls here.
app.UseDefaultFiles();
app.MapStaticAssets();

app.UseHttpsRedirection();

app.MapControllers();

// Every other route belongs to the Angular router.
app.MapFallbackToFile("/index.html");

app.Run();
