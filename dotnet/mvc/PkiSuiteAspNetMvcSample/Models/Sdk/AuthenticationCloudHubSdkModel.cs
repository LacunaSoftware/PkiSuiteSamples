using Lacuna.Cloudhub.Api;
using System.Collections.Generic;

namespace PkiSuiteAspNetMvcSample.Models.Sdk
{
    public class AuthenticationCloudHubSdkModel
    {
        public List<TrustServiceAuthParametersModel> Services { get; set; }
        public string Cpf { get; set; }

    }
}