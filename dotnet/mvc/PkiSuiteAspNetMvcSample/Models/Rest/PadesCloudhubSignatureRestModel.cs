using System.Collections.Generic;
using Lacuna.Cloudhub.Api;
using Lacuna.RestPki.Client;

namespace PkiSuiteAspNetMvcSample.Models.Rest {
    public class PadesCloudhubSignatureRestModel {
        public string FileId { get; set; }
        public string Cpf { get; set; }
        public List<TrustServiceAuthParametersModel> Services { get; set; }
        public SessionModel CloudHubSession { get; set; }
    }
}
