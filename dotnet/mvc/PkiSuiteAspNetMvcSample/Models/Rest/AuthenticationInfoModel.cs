﻿using Lacuna.RestPki.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PkiSuiteAspNetMvcSample.Models.Rest {

	public class AuthenticationInfoModel {
		public PKCertificate UserCert { get; set; }
	}
}