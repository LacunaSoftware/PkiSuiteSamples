using Lacuna.Cloudhub.Api;
using Lacuna.Pki.BrazilTrustServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PkiSuiteAspNetMvcSample.Models.Sdk
{
    public class PadesCloudOauthAltModel
    {
        public List<TrustServiceAuthParametersModel> Services { get; set; }
        public string Cpf { get; set; }
    }
}