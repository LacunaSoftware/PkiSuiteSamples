using Lacuna.Pki;
using Lacuna.Pki.Cades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PkiSuiteAspNetMvcSample.Classes {
	public class CadesPolicyMapperWrapper : ICadesPolicyMapper {

		private ICadesPolicyMapper policyMapper;
		private ITrustArbitrator trustArbitrator;

		public CadesPolicyMapperWrapper(ICadesPolicyMapper policyMapper, ITrustArbitrator trustArbitrator)
		{
			this.policyMapper = policyMapper;
			this.trustArbitrator = trustArbitrator;
		}

		public CadesPolicySpec GetPolicy(PKCertificate certificate)
		{
			var policy = policyMapper.GetPolicy(certificate);
			policy.ClearTrustArbitrator();
			policy.AddTrustArbitrator(trustArbitrator);
			return policy;
		}
	}
}