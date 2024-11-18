using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PkiSuiteAspNetMvcSample.Models.Rest {
    public class BatchPadesSignatureRestCompleteRequest {
        public string Id { get; set; }
        public byte[] Signature { get; set; }

        public string SignatureBase64 {
            get {
                return Signature != null ? Convert.ToBase64String(Signature) : "";
            }
            set {
                Signature = !string.IsNullOrEmpty(value) ? Convert.FromBase64String(value) : null;
            }
        }
    }
}