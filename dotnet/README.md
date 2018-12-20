# PKI Suite samples for .NET

This folder contains **.NET sample projects** demonstrating the usage of Lacuna Software's
**[PKI Suite](https://www.lacunasoftware.com/pki-suite)**.

For other languages, please visit the [repository root](https://github.com/LacunaSoftware/PkiSuiteSamples).

Default sample (ASP.NET MVC)
----------------------------

A sample using **ASP.NET MVC** can be found in the folder [MVC](MVC/).

Steps to execute the sample:

1. [Download the project](https://github.com/LacunaSoftware/PkiSuiteSamples/archive/master.zip)
   or clone the repository

1. Open the desired project folder -- [MVC](mvc/) or one of the other projects (see below) 

1. Open the solution file (.sln) on Visual Studio
   
1. Generate an API access token on the [REST PKI website](https://pki.rest/) and
   paste your token on the file `web.config`
   
1. Copy your SDK license file (`LacunaPkiLicense.config`) to the folder `mvc\PkiSuiteAspNetMvcSample`
   
1. Run the solution. Make sure your system allows automatic Nuget package restore (if it doesn't,
   manually restore the packages).

ASP.NET Web API
---------------

A sample using **ASP.NET Web API** can be found in the folder [webapi](webapi/).
The steps to execute the sample are the same as for the default sample.

**NOTICE:** This sample is currently being migrated. For now, please visit
https://github.com/LacunaSoftware/PkiSdkSamples/tree/master/WebAPI

ASP.NET Web Forms sample
------------------------

A sample using **ASP.NET Web Forms** can be found in the folder [webforms](webforms/).
The steps to execute the sample are the same as for the default sample.

**NOTICE:** This sample is currently being migrated. For now, please visit
https://github.com/LacunaSoftware/RestPkiSamples/tree/master/CSharp/WebForms or
https://github.com/LacunaSoftware/PkiSdkSamples/tree/master/WebForms

ASP.NET Core Web application sample
-----------------------------------

A sample using the new **ASP.NET Core** technology can be found in the folder [core](core/).

**NOTICE:** This sample is currently being migrated. For now, please visit
https://github.com/LacunaSoftware/RestPkiSamples/tree/master/CSharp/AspNetCore

.NET client lib
---------------

The samples use the Nuget package [Lacuna.RestPki.Client](https://www.nuget.org/packages/Lacuna.RestPki.Client/),
a library which encapsulates the API calls to REST PKI. It supports .NET Frameworks 3.5, 4.0 and 4.5 as well as
.NET Standard 1.3 (for usage on .NET Core, Xamarin, Mono and UWP).

See also
--------

* [Test certificates](https://docs.lacunasoftware.com/articles/pki-guide/test-certs)
* [Samples in other programming languages](https://github.com/LacunaSoftware/PkiSuiteSamples)
* [REST PKI .NET client lib on Nuget](https://www.nuget.org/packages/Lacuna.RestPki.Client)
