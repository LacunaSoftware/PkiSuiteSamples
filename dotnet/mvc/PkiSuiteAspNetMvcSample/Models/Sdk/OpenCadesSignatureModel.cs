using PkiSuiteAspNetMvcSample.Models.Sdk;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PkiSuiteAspNetMvcSample.Models.Sdk
{
    public class OpenCadesSignatureModel
    {
        public string File { get; set; }
        public CadesSignatureModel Signature { get; set; }
    }
}